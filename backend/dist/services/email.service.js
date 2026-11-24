"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailByIdService = exports.getAllEmailsService = exports.scheduleEmailService = void 0;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const email_queue_js_1 = require("../queue/email.queue.js");
const redis_js_1 = __importDefault(require("../config/redis.js"));
const scheduleEmailService = async (data) => {
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
            const count = await redis_js_1.default.incr(hourKey);
            if (count === 1) {
                // Set expiry for 2 hours just to be safe
                await redis_js_1.default.expire(hourKey, 7200);
            }
            if (count <= hourlyLimit) {
                windowFound = true;
            }
            else {
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
    const createdEmails = await Promise.all(emails.map(async (e) => {
        const email = await prisma_js_1.default.emailJob.create({
            data: {
                userId: data.userId,
                recipient: e.recipient,
                subject: data.subject,
                body: data.body,
                scheduledAt: new Date(e.scheduledTime),
            },
        });
        const delayMs = Math.max(e.scheduledTime - Date.now(), 0);
        const job = await email_queue_js_1.emailQueue.add("send-email", { emailId: email.id }, {
            jobId: email.id, // Idempotency
            delay: delayMs,
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
        });
        return email;
    }));
    return createdEmails;
};
exports.scheduleEmailService = scheduleEmailService;
const getAllEmailsService = async (userId) => {
    return prisma_js_1.default.emailJob.findMany({
        where: { userId },
        orderBy: {
            scheduledAt: "asc",
        },
    });
};
exports.getAllEmailsService = getAllEmailsService;
const getEmailByIdService = async (id, userId) => {
    return prisma_js_1.default.emailJob.findUnique({
        where: {
            id,
            userId,
        },
    });
};
exports.getEmailByIdService = getEmailByIdService;
