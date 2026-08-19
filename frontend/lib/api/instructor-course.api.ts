import { del, get, patch, post } from "./client";

export interface CreateCourseRequest {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail?: string;
  status: string;
}

export interface UpdateCourseRequest {
  title?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  level?: string;
  price?: number;
  thumbnail?: string;
  status?: string;
}

export interface Course {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string | null;
  category?: string;
  level?: string;
  price: number;
  thumbnail?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  studentsCount?: number;
  lessonsCount?: number;
}

export interface CreateCourseResponse {
  message: string;
  course: Course;
}

export interface GetCoursesResponse {
  courses: Course[];
}

export interface GetSingleCourseResponse {
  course: Course;
}

export interface DeleteCourseResponse {
  message: string;
}

export async function createCourse(
  data: CreateCourseRequest
): Promise<CreateCourseResponse> {
  return post<CreateCourseResponse>("/courses", data);
}

export async function getAllCourses(): Promise<GetCoursesResponse> {
  return get<GetCoursesResponse>("/courses?includeDrafts=true");
}

export async function getCourseById(courseId: string): Promise<GetSingleCourseResponse> {
  return get<GetSingleCourseResponse>(`/courses/${courseId}`);
}

export async function updateCourse(
  courseId: string,
  data: UpdateCourseRequest
): Promise<CreateCourseResponse> {
  return patch<CreateCourseResponse>(`/courses/${courseId}`, data);
}

export async function deleteCourse(courseId: string): Promise<DeleteCourseResponse> {
  return del<DeleteCourseResponse>(`/courses/${courseId}`);
}