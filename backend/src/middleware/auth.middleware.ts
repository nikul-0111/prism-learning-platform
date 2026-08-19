import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { findUserById } from "../repositories/user.repository.js";

interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    mobileNumber: string;
    email: string;
    role: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Bearer token is required",
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token is required",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      env.AUTH_SECRET,
    ) as JwtPayload;

    if (!decoded.id) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return;
    }

    const user = await findUserById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}