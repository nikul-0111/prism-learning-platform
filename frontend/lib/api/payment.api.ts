import { post } from "./client";

export interface CreateOrderResponse {
  message: string;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    courseTitle: string;
    coursePrice: number;
  };
}

export interface VerifyPaymentPayload {
  courseId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  receipt: {
    paymentId: string;
    orderId: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    amountPaid: string;
    date: string;
    status: string;
  };
  enrollment: any;
}

export async function createPaymentOrderApi(courseId: string) {
  return post<CreateOrderResponse>("/payments/create-order", { courseId });
}

export async function verifyPaymentApi(payload: VerifyPaymentPayload) {
  return post<VerifyPaymentResponse>("/payments/verify", payload);
}
