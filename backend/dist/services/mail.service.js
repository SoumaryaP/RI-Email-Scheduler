"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const mail_js_1 = __importDefault(require("../config/mail.js"));
async function sendEmail(recipient, subject, body) {
    return mail_js_1.default.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject,
        text: body,
    });
}
