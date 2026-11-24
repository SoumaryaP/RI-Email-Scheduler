"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_js_1 = __importDefault(require("../config/redis.js"));
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const mail_service_js_1 = require("../services/mail.service.js");
const worker = new bullmq_1.Worker("email-queue", async (job) => {
    const { emailId } = job.data;
    const email = await prisma_js_1.default.emailJob.findUnique({
        where: {
            id: emailId,
        },
    });
    if (!email) {
        throw new Error("Email not found");
    }
    try {
        await (0, mail_service_js_1.sendEmail)(email.recipient, email.subject, email.body);
        await prisma_js_1.default.emailJob.update({
            where: {
                id: email.id,
            },
            data: {
                status: "SENT",
            },
        });
        console.log("✅ Email Sent");
    }
    catch (err) {
        await prisma_js_1.default.emailJob.update({
            where: {
                id: email.id,
            },
            data: {
                status: "FAILED",
            },
        });
        throw err;
    }
}, {
    connection: redis_js_1.default,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || "5", 10),
    limiter: {
        max: 5, // Maximum 5 jobs
        duration: 1000, // per 1 second (1000ms)
    },
});
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
worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed`);
    console.error(err);
});
