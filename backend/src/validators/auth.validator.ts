import { z } from "zod";

const userRoleSchema = z.enum([
  "STUDENT",
  "INSTRUCTOR",
  "ADMIN",
]);

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    mobileNumber: z
      .string()
      .trim()
      .transform((val) => val.replace(/^(\+91|0)/, "").replace(/\D/g, ""))
      .refine((val) => /^[6-9]\d{9}$/.test(val), {
        message: "Please enter a valid 10-digit Indian mobile number",
      }),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),

    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),

    role: userRoleSchema,
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;