import type { CourseLevel, CourseStatus } from "@prisma/client";

export interface CreateCourseInput {
  title: string;
  shortDescription?: string;
  description: string;
  category?: string;
  level?: CourseLevel;
  price: number;
  thumbnail?: string;
  status?: CourseStatus;
}

export interface UpdateCourseInput {
  title?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  level?: CourseLevel;
  price?: number;
  thumbnail?: string;
  status?: CourseStatus;
}

export interface CourseQueryFilters {
  category?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  instructorId?: string;
  page?: number;
  limit?: number;
}

export interface CourseResponseDTO {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string;
  category: string | null;
  level: CourseLevel;
  price: number;
  thumbnail: string | null;
  status: CourseStatus;
  instructorId: string;
  createdAt: Date;
  updatedAt: Date;
}