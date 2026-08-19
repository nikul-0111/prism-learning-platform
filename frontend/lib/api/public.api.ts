import { get, post } from "./client";

export interface PublicCourse {
  id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  thumbnail?: string | null;
  price: number;
  level: string;
  status: string;
  category?: {
    id: string;
    name: string;
  } | null;
  instructor?: {
    id: string;
    name: string;
  } | null;
  sectionsCount?: number;
  lessonsCount?: number;
  sections?: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      type: string;
      videoUrl?: string | null;
      content?: string | null;
      duration?: number;
      isFreePreview?: boolean;
    }[];
  }[];
}

export interface GetPublicCoursesParams {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
}

export async function getPublicCourses(params?: GetPublicCoursesParams) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.category) query.append("category", params.category);
  if (params?.level) query.append("level", params.level);
  if (params?.search) query.append("search", params.search);

  return get<{
    message: string;
    data: PublicCourse[];
  }>(`/courses?${query.toString()}`);
}

export async function getPublicCourseById(courseId: string) {
  return get<{
    message: string;
    data: PublicCourse;
  }>(`/courses/${courseId}`);
}

export async function enrollInCourseApi(courseId: string) {
  return post<{
    message: string;
    data: any;
    isNew?: boolean;
  }>(`/courses/${courseId}/enroll`);
}

export async function getMyEnrollmentsApi() {
  return get<{
    message: string;
    data: {
      id: string;
      userId: string;
      courseId: string;
      createdAt: string;
      course: PublicCourse;
    }[];
  }>("/enrollments");
}

export async function getQuizByLessonApi(lessonId: string) {
  return get<{
    message?: string;
    data: {
      quiz: {
        id: string;
        title: string;
        passMark: number;
        timeLimit: number;
        maxAttempts: number;
        questions: {
          id: string;
          text: string;
          type: string;
          position: number;
          answers: {
            id: string;
            text: string;
            isCorrect?: boolean;
          }[];
        }[];
      } | null;
    };
  }>(`/student/lessons/${lessonId}/quiz`);
}
