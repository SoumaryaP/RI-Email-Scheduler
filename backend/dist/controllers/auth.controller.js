"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = void 0;
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const client = googleClientId ? new google_auth_library_1.OAuth2Client(googleClientId) : null;
const googleLogin = async (req, res) => {
    try {
        if (!googleClientId || !client) {
            res.status(500).json({ error: "Google OAuth is not configured on the server" });
            return;
        }
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: "Invalid Google token" });
            return;
        }
        const { email, name, picture } = payload;
        let user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            user = await db_1.prisma.user.create({
                data: {
                    email,
                    name: name || "Google User",
                    picture,
                },
            });
        }
        else {
            user = await db_1.prisma.user.update({
                where: { email },
                data: {
                    name: name || user.name,
                    picture: picture || user.picture,
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: "7d" });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
        });
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        const details = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Authentication failed",
            details,
        });
    }
};
exports.googleLogin = googleLogin;
