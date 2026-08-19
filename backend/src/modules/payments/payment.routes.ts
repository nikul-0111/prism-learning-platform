import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
  getHistory,
  getInstructorPayoutsData,
  getInstructorAnalytics,
} from "./payment.controller.js";

const router = Router();

router.post("/payments/create-order", authMiddleware, createOrder);
router.post("/payments/verify", authMiddleware, verifyPayment);
router.get("/payments/history", authMiddleware, getHistory);
router.get("/payments/instructor-payouts", authMiddleware, getInstructorPayoutsData);
router.get("/analytics/instructor", authMiddleware, getInstructorAnalytics);

export default router;

