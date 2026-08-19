import { Router } from "express";

import {
  register,
  login,
  me,
  googleCheck,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * POST /api/auth/google-check
 * Check if user exists in database for Google login
 */
router.post("/google-check", googleCheck);

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post("/login", login);

/**
 * GET /api/auth/me
 * Get currently authenticated user
 */
router.get("/me", authMiddleware, me);

export default router;