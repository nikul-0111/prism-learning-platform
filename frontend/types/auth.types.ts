export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface RegisterRequest {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: UserRole;
}

export interface AuthResponse {
  success?: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
  token?: string;
  user?: AuthUser;
}

export interface RegisterResponse {
  success?: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
  token?: string;
  user?: AuthUser;
}

export interface LoginResponse {
  success?: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
  token?: string;
  user?: AuthUser;
}