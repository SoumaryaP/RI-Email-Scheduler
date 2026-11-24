import transporter from "../config/mail.js";

export async function sendEmail(
  recipient: string,
  subject: string,
  body: string
) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    text: body,
  });
}