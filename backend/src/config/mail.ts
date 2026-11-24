import "dotenv/config";
import nodemailer from "nodemailer";

const port = parseInt(process.env.SMTP_PORT || "587", 10);
const secure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE.toLowerCase() === "true"
  : port === 465;

if (!process.env.BREVO_API_KEY && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
  console.warn("⚠️  EMAIL_USER / EMAIL_PASS are not set — emails will fail to send");
}

// Ethereal Email (fake SMTP) by default; override with SMTP_HOST/SMTP_PORT.
const transporter = nodemailer.createTransport({
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
export async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
  } catch (err: any) {
    console.error(
      `❌ SMTP verification failed (${err.code ?? "unknown"}): ${err.message}. ` +
        (err.code === "EAUTH"
          ? "Check EMAIL_USER / EMAIL_PASS."
          : "Check SMTP_HOST / SMTP_PORT — the host may block outbound SMTP.")
    );
  }
}

export default transporter;