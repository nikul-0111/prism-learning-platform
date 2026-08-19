import Razorpay from "razorpay";

export const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_TCtzaWQS6tuDuo";
export const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_key";

export const razorpayInstance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
