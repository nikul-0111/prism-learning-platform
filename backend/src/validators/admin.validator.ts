import { z } from "zod";

export const rejectCourseSchema = z.object({
  reason: z
    .string()
    .min(5, "Rejection reason must be at least 5 characters long")
    .max(1000, "Rejection reason must not exceed 1000 characters"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"] as const),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});
