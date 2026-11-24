"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryEmailSchema = exports.scheduleEmailSchema = void 0;
const zod_1 = require("zod");
exports.scheduleEmailSchema = zod_1.z.object({
    recipient: zod_1.z.string().email("Invalid email address").optional(),
    recipients: zod_1.z.array(zod_1.z.string().email("Invalid email address")).optional(),
    subject: zod_1.z
        .string()
        .min(1, "Subject is required"),
    body: zod_1.z
        .string()
        .min(1, "Body is required"),
    scheduledAt: zod_1.z.coerce.date(),
    delay: zod_1.z.number().min(0).optional().default(0), // Delay between emails in seconds
    hourlyLimit: zod_1.z.number().min(1).optional().default(100), // Max emails per hour
}).refine(data => data.recipient || (data.recipients && data.recipients.length > 0), {
    message: "Either recipient or recipients array must be provided",
});
exports.retryEmailSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
