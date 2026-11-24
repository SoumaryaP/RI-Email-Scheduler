import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const client = googleClientId ? new OAuth2Client(googleClientId) : null;

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
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

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Google User",
          picture,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          picture: picture || user.picture,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
