import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};
