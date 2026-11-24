import { Router } from "express";
import { googleLogin } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import { googleAuthSchema } from "../validators/auth.validator";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post(
  "/google",
  authLimiter,
  validateBody(googleAuthSchema),
  googleLogin
);

export default router;