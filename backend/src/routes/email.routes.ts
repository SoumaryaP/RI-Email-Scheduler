import { Router } from "express";
import multer from "multer";
import {
  schedule,
  uploadCsvAndSchedule,
  listScheduled,
  listSent,
  getOne,
  cancel,
  retry,
} from "../controllers/email.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import {
  scheduleEmailSchema,
  retryEmailSchema,
} from "../validators/email.validator";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = Router();

// Protect all email routes
router.use(requireAuth);

// Schedule a single email
router.post(
  "/schedule",
  validateBody(scheduleEmailSchema),
  schedule
);

// Upload CSV and schedule emails
router.post(
  "/schedule/csv",
  upload.single("file"),
  uploadCsvAndSchedule
);

// Get all scheduled emails
router.get("/scheduled", listScheduled);

// Get all sent emails
router.get("/sent", listSent);

// Get email by ID
router.get("/:id", getOne);

// Cancel email
router.delete("/:id", cancel);

// Update email
router.patch("/:id", async (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
});

// Retry failed email
router.post(
  "/retry",
  validateBody(retryEmailSchema),
  retry
);

export default router;