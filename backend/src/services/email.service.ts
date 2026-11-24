import prisma from "../config/prisma.js";
import { emailQueue } from "../queue/email.queue.js";
import redis from "../config/redis.js";

export interface ScheduleEmailInput {
  userId: string;
  recipients: string[];
  subject: string;
  body: string;
  scheduledAt: Date;
  delay?: number;
  hourlyLimit?: number;
}

export const scheduleEmailService = async (
  data: ScheduleEmailInput
) => {
  const delaySec = data.delay || 0;
  const hourlyLimit = data.hourlyLimit || 100;
  
  const emails = [];
  let currentTargetTime = new Date(data.scheduledAt).getTime();
  
  for (let i = 0; i < data.recipients.length; i++) {
    const recipient = data.recipients[i];
    
    // Find the next available hour window
    let scheduledTime = currentTargetTime;
    let windowFound = false;
    
    while (!windowFound) {
      const hourKey = `ratelimit:email:${data.userId}:${Math.floor(scheduledTime / 3600000)}`;
      // Atomic increment
      const count = await redis.incr(hourKey);
      if (count === 1) {
        // Set expiry for 2 hours just to be safe
        await redis.expire(hourKey, 7200);
      }
      
      if (count <= hourlyLimit) {
        windowFound = true;
      } else {
        // Move to next hour
        scheduledTime += 3600000;
      }
    }
    
    emails.push({
      recipient,
      scheduledTime
    });
    
    // Advance target time by delay for the next email
    currentTargetTime = scheduledTime + (delaySec * 1000);
  }
  
  const createdEmails = await Promise.all(
    emails.map(async (e) => {
      const email = await prisma.emailJob.create({
        data: {
          userId: data.userId,
          recipient: e.recipient,
          subject: data.subject,
          body: data.body,
          scheduledAt: new Date(e.scheduledTime),
        },
      });

      const delayMs = Math.max(e.scheduledTime - Date.now(), 0);

      const job = await emailQueue.add(
        "send-email",
        { emailId: email.id },
        {
          jobId: email.id, // Idempotency
          delay: delayMs,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        }
      );
      
      return email;
    })
  );

  return createdEmails;
};

export const getAllEmailsService = async (userId: string) => {
  return prisma.emailJob.findMany({
    where: { userId },
    orderBy: {
      scheduledAt: "asc",
    },
  });
};

export const getEmailByIdService = async (id: string, userId: string) => {
  return prisma.emailJob.findUnique({
    where: {
      id,
      userId,
    },
  });
};