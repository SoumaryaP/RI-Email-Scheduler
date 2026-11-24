"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Unauthorized: Missing token" });
            return;
        }
        const secret = process.env.JWT_SECRET || "default_secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            res.status(401).json({ error: "Unauthorized: User not found" });
            return;
        }
        req.user = { id: user.id, email: user.email };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
    }
};
exports.requireAuth = requireAuth;
