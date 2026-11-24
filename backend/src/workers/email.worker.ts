import { Worker } from "bullmq";
import redis from "../config/redis.js";
import prisma from "../config/prisma.js";
import { sendEmail, useBrevo } from "../services/mail.service.js";
import { verifyTransporter } from "../config/mail.js";

if (useBrevo) {
  console.log("📧 Email provider: Brevo HTTP API");
} else {
  console.log("📧 Email provider: SMTP");
  void verifyTransporter();
}

const worker = new Worker(
  "email-queue",
  async (job) => {
    const { emailId } = job.data;

    const email = await prisma.emailJob.findUnique({
      where: {
        id: emailId,
      },
    });

    if (!email) {
      throw new Error("Email not found");
    }

    try {
      await sendEmail(
        email.recipient,
        email.subject,
        email.body
      );

      await prisma.emailJob.update({
        where: {
          id: email.id,
        },
        data: {
          status: "SENT",
        },
      });

      console.log("✅ Email Sent");
    } catch (err) {
      // Only mark FAILED once BullMQ has no retries left.
      const maxAttempts = job.opts.attempts ?? 1;
      if (job.attemptsMade + 1 >= maxAttempts) {
        await prisma.emailJob.update({
          where: {
            id: email.id,
          },
          data: {
            status: "FAILED",
          },
        });
      }

      throw err;
    }
  },
  {
    connection: redis,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || "5", 10),
    limiter: {
      max: 5, // Maximum 5 jobs
      duration: 1000, // per 1 second (1000ms)
    },
  }
);
worker.on("ready", () => {
  console.log("✅ Worker is ready");
});

worker.on("active", (job) => {
  console.log("🟢 Active:", job.id);
});

worker.on("completed", (job) => {
  console.log("✅ Completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("❌ Failed:", job?.id);
  console.error(err);
});

worker.on("error", (err) => {
  console.error("🔥 Worker Error:", err);
});