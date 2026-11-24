"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const email_routes_js_1 = __importDefault(require("./routes/email.routes.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://new-email-scheduler.vercel.app",
    ],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(rateLimiter_js_1.apiLimiter);
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/emails", email_routes_js_1.default);
app.get("/", (_, res) => {
    res.send("Email Scheduler API Running 🚀");
});
exports.default = app;
