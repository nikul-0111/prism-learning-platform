import { post } from "./client";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.types";

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return post<RegisterResponse>("/auth/register", data);
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  return post<LoginResponse>("/auth/login", data);
}