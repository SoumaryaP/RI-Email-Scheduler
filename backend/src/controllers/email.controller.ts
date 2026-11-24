import { Request, Response } from "express";
import { scheduleEmailSchema } from "../validators/email.validator.js";
import {
  scheduleEmailService,
  getAllEmailsService,
  getEmailByIdService,
} from "../services/email.service.js";
import prisma from "../config/prisma.js";

export const schedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = scheduleEmailSchema.parse(req.body);
    const userId = req.user!.id; // from requireAuth

    const recipients = validatedData.recipients || [];
    if (validatedData.recipient && !recipients.includes(validatedData.recipient)) {
      recipients.push(validatedData.recipient);
    }

    const emails = await scheduleEmailService({ 
      ...validatedData,
      recipients,
      userId 
    });

    res.status(201).json({ success: true, data: emails });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const listScheduled = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const emails = await getAllEmailsService(userId);
    const scheduled = emails.filter(e => e.status === "SCHEDULED");

    res.status(200).json({ success: true, data: scheduled });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listSent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const emails = await getAllEmailsService(userId);
    const sent = emails.filter(e => e.status === "SENT");

    res.status(200).json({ success: true, data: sent });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOne = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const email = await getEmailByIdService(id, userId);

    if (!email) {
      res.status(404).json({ success: false, message: "Email not found" });
      return;
    }

    res.status(200).json({ success: true, data: email });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancel = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const email = await getEmailByIdService(id, userId);

    if (!email) {
      res.status(404).json({ success: false, message: "Email not found" });
      return;
    }

    await prisma.emailJob.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Email cancelled successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const retry = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const uploadCsvAndSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
       res.status(400).json({ success: false, message: "No CSV file uploaded" });
       return;
    }

    const csvData = req.file.buffer.toString("utf8");
    // Extract emails using a regex (or splitting by comma/newline)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = csvData.match(emailRegex) || [];
    // Deduplicate
    const recipients = [...new Set(matches)];

    if (recipients.length === 0) {
      res.status(400).json({ success: false, message: "No valid email addresses found in CSV" });
      return;
    }

    // parse the rest of the body
    const bodyData = {
      recipients,
      subject: req.body.subject,
      body: req.body.body,
      scheduledAt: req.body.scheduledAt,
      delay: req.body.delay ? parseInt(req.body.delay, 10) : 0,
      hourlyLimit: req.body.hourlyLimit ? parseInt(req.body.hourlyLimit, 10) : 100,
    };

    const validatedData = scheduleEmailSchema.parse(bodyData);
    const userId = req.user!.id;

    const emails = await scheduleEmailService({ 
      ...validatedData,
      recipients,
      userId 
    });

    res.status(201).json({ success: true, data: emails, count: recipients.length });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};