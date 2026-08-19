import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import {
  createPaymentOrder,
  verifyPaymentSignature,
  getPaymentHistory,
  getInstructorPayouts,
  getInstructorAnalyticsOverview,
} from "./payment.service.js";

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required." });
    }

    const orderData = await createPaymentOrder(req.user.id, courseId);

    return res.status(200).json({
      message: "Razorpay order created.",
      data: orderData,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create order.",
    });
  }
}

export async function verifyPayment(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required." });
    }

    const result = await verifyPaymentSignature(
      req.user.id,
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Payment verification failed.",
    });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const history = await getPaymentHistory(req.user.id);
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch payment history.",
    });
  }
}

export async function getInstructorPayoutsData(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const data = await getInstructorPayouts(req.user.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch instructor payout data.",
    });
  }
}

export async function getInstructorAnalytics(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const data = await getInstructorAnalyticsOverview(req.user.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch instructor analytics.",
    });
  }
}



