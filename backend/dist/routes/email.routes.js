"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const email_controller_1 = require("../controllers/email.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const email_validator_1 = require("../validators/email.validator");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
const router = (0, express_1.Router)();
// Protect all email routes
router.use(auth_middleware_1.requireAuth);
// Schedule a single email
router.post("/schedule", (0, validate_middleware_1.validateBody)(email_validator_1.scheduleEmailSchema), email_controller_1.schedule);
// Upload CSV and schedule emails
router.post("/schedule/csv", upload.single("file"), email_controller_1.uploadCsvAndSchedule);
// Get all scheduled emails
router.get("/scheduled", email_controller_1.listScheduled);
// Get all sent emails
router.get("/sent", email_controller_1.listSent);
// Get email by ID
router.get("/:id", email_controller_1.getOne);
// Cancel email
router.delete("/:id", email_controller_1.cancel);
// Update email
router.patch("/:id", async (req, res) => {
    res.status(501).json({ success: false, message: "Not implemented yet" });
});
// Retry failed email
router.post("/retry", (0, validate_middleware_1.validateBody)(email_validator_1.retryEmailSchema), email_controller_1.retry);
exports.default = router;
