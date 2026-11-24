import { z } from "zod";

export const scheduleEmailSchema = z.object({
  recipient: z.string().email("Invalid email address").optional(),
  recipients: z.array(z.string().email("Invalid email address")).optional(),

  subject: z
    .string()
    .min(1, "Subject is required"),

  body: z
    .string()
    .min(1, "Body is required"),

  scheduledAt: z.coerce.date(),

  delay: z.number().min(0).optional().default(0), // Delay between emails in seconds
  hourlyLimit: z.number().min(1).optional().default(100), // Max emails per hour
}).refine(data => data.recipient || (data.recipients && data.recipients.length > 0), {
    message: "Either recipient or recipients array must be provided",
});

export const retryEmailSchema = z.object({
  id: z.string(),
});