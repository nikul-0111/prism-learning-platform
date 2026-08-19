import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  if (error instanceof ZodError) {
    const primaryMessage = error.issues[0]?.message || "Validation failed";
    res.status(400).json({
      success: false,
      message: primaryMessage,
      errors: error.issues,
    });
    return;
  }

  if (error instanceof Error) {
    let msg = error.message;
    if (msg.includes("Unique constraint failed")) {
      if (msg.includes("mobileNumber")) {
        msg = "User with this mobile number already exists";
      } else if (msg.includes("email")) {
        msg = "User with this email address already exists";
      }
    }
    res.status(400).json({
      success: false,
      message: msg,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};