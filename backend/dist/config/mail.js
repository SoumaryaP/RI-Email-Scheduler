"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTransporter = verifyTransporter;
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const port = parseInt(process.env.SMTP_PORT || "587", 10);
const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : port === 465;
if (!process.env.BREVO_API_KEY && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
    console.warn("⚠️  EMAIL_USER / EMAIL_PASS are not set — emails will fail to send");
}
// Ethereal Email (fake SMTP) by default; override with SMTP_HOST/SMTP_PORT.
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port,
    secure,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
});
// Surface SMTP problems (bad credentials, blocked port) at startup instead of
// only when a scheduled job fires.
async function verifyTransporter() {
    try {
        await transporter.verify();
        console.log("✅ SMTP connection verified");
    }
    catch (err) {
        console.error(`❌ SMTP verification failed (${err.code ?? "unknown"}): ${err.message}. ` +
            (err.code === "EAUTH"
                ? "Check EMAIL_USER / EMAIL_PASS."
                : "Check SMTP_HOST / SMTP_PORT — the host may block outbound SMTP."));
    }
}
exports.default = transporter;
