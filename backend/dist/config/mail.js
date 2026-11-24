"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// Using Ethereal Email for fake SMTP as required
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // User should set Ethereal username here
        pass: process.env.EMAIL_PASS, // User should set Ethereal password here
    },
});
exports.default = transporter;
