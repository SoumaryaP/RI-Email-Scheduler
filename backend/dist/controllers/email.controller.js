"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCsvAndSchedule = exports.retry = exports.cancel = exports.getOne = exports.listSent = exports.listScheduled = exports.schedule = void 0;
const email_validator_js_1 = require("../validators/email.validator.js");
const email_service_js_1 = require("../services/email.service.js");
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const schedule = async (req, res) => {
    try {
        const validatedData = email_validator_js_1.scheduleEmailSchema.parse(req.body);
        const userId = req.user.id; // from requireAuth
        const recipients = validatedData.recipients || [];
        if (validatedData.recipient && !recipients.includes(validatedData.recipient)) {
            recipients.push(validatedData.recipient);
        }
        const emails = await (0, email_service_js_1.scheduleEmailService)({
            ...validatedData,
            recipients,
            userId
        });
        res.status(201).json({ success: true, data: emails });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.schedule = schedule;
const listScheduled = async (req, res) => {
    try {
        const userId = req.user.id;
        const emails = await (0, email_service_js_1.getAllEmailsService)(userId);
        const scheduled = emails.filter(e => e.status === "SCHEDULED");
        res.status(200).json({ success: true, data: scheduled });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.listScheduled = listScheduled;
const listSent = async (req, res) => {
    try {
        const userId = req.user.id;
        const emails = await (0, email_service_js_1.getAllEmailsService)(userId);
        const sent = emails.filter(e => e.status === "SENT");
        res.status(200).json({ success: true, data: sent });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.listSent = listSent;
const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const email = await (0, email_service_js_1.getEmailByIdService)(id, userId);
        if (!email) {
            res.status(404).json({ success: false, message: "Email not found" });
            return;
        }
        res.status(200).json({ success: true, data: email });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOne = getOne;
const cancel = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const email = await (0, email_service_js_1.getEmailByIdService)(id, userId);
        if (!email) {
            res.status(404).json({ success: false, message: "Email not found" });
            return;
        }
        await prisma_js_1.default.emailJob.delete({ where: { id } });
        res.status(200).json({ success: true, message: "Email cancelled successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.cancel = cancel;
const retry = async (req, res) => {
    res.status(501).json({ success: false, message: "Not implemented yet" });
};
exports.retry = retry;
const uploadCsvAndSchedule = async (req, res) => {
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
        const validatedData = email_validator_js_1.scheduleEmailSchema.parse(bodyData);
        const userId = req.user.id;
        const emails = await (0, email_service_js_1.scheduleEmailService)({
            ...validatedData,
            recipients,
            userId
        });
        res.status(201).json({ success: true, data: emails, count: recipients.length });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.uploadCsvAndSchedule = uploadCsvAndSchedule;
