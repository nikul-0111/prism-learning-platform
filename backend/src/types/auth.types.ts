import type { UserRole } from "../../generated/prisma/enums.js";

export interface AuthUser {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface JwtUser {
  id: string;
  role: UserRole;
}