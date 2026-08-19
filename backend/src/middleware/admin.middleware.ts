import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export function adminGuard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const role = req.user.role?.toUpperCase();
  if (role !== "ADMIN") {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
    return;
  }

  next();
}
