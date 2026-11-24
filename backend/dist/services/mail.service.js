"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBrevo = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_js_1 = __importDefault(require("../config/mail.js"));
// When BREVO_API_KEY is set, mail goes out over Brevo's HTTPS API (works on
// hosts like Render that block outbound SMTP, and needs only a verified sender
// address — no domain). Otherwise it falls back to SMTP (Ethereal by default).
exports.useBrevo = Boolean(process.env.BREVO_API_KEY);
async function sendViaBrevo(recipient, subject, body) {
    const senderEmail = process.env.EMAIL_FROM;
    if (!senderEmail) {
        throw new Error("EMAIL_FROM must be set to a Brevo-verified sender address");
    }
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            sender: {
                email: senderEmail,
                name: process.env.EMAIL_FROM_NAME || "Email Scheduler",
            },
            to: [{ email: recipient }],
            subject,
            textContent: body,
        }),
        signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
        throw new Error(`Brevo send failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json());
    console.log(`📨 Sent via Brevo to ${recipient} (${data.messageId ?? "no id"})`);
    return data;
}
async function sendViaSmtp(recipient, subject, body) {
    const info = await mail_js_1.default.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: recipient,
        subject,
        text: body,
    });
    // Ethereal captures mail instead of delivering it; log where to view it.
    const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
    if (previewUrl) {
        console.log(`📨 Preview (${recipient}): ${previewUrl}`);
    }
    return info;
}
async function sendEmail(recipient, subject, body) {
    return exports.useBrevo
        ? sendViaBrevo(recipient, subject, body)
        : sendViaSmtp(recipient, subject, body);
}
