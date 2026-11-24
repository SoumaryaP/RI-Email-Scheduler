import nodemailer from "nodemailer";

// Using Ethereal Email for fake SMTP as required
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // User should set Ethereal username here
    pass: process.env.EMAIL_PASS, // User should set Ethereal password here
  },
});

export default transporter;