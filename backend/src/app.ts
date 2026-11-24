import express from "express";
import cors from "cors";
import helmet from "helmet";

import emailRoutes from "./routes/email.routes.js";
import authRoutes from "./routes/auth.routes.js";

import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://new-email-scheduler.vercel.app",
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());

app.use(apiLimiter);

app.use("/api/auth", authRoutes);

app.use("/api/emails", emailRoutes);

app.get("/", (_, res) => {
  res.send("Email Scheduler API Running 🚀");
});

export default app;