import type { Request, Response } from "express";

import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  checkGoogleUser,
} from "../services/auth.service.js";

export async function googleCheck(
  req: Request,
  res: Response,
): Promise<void> {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required",
    });
    return;
  }

  const result = await checkGoogleUser(email);

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function register(
  req: Request,
  res: Response,
): Promise<void> {
  const input = registerSchema.parse(req.body);

  const result = await registerUser(input);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
}

export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  const input = loginSchema.parse(req.body);

  const result = await loginUser(input);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
}

export async function me(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  const user = await getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
}