import { del, get, patch, post } from "./client";
import { QuizData } from "./instructor-quiz.api";

export type LessonType = "VIDEO" | "ARTICLE" | "QUIZ" | "FILE";

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description?: string | null;
  type: LessonType;
  videoUrl?: string | null;
  content?: string | null;
  duration?: number;
  position?: number;
  isFreePreview?: boolean;
  quizId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  duration?: number;
  isFreePreview?: boolean;
  quizData?: QuizData;
}

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  duration?: number;
  position?: number;
  isFreePreview?: boolean;
  quizData?: QuizData;
}

export interface LessonsResponse {
  message?: string;
  data: {
    lessons: Lesson[];
  };
}

export interface LessonResponse {
  message?: string;
  data: {
    lesson: Lesson;
  };
}

export async function getLessons(sectionId: string): Promise<LessonsResponse> {
  return get<LessonsResponse>(`/instructor/sections/${sectionId}/lessons`);
}

export async function createLesson(
  sectionId: string,
  data: CreateLessonRequest
): Promise<LessonResponse> {
  return post<LessonResponse>(`/instructor/sections/${sectionId}/lessons`, data);
}

export async function updateLesson(
  lessonId: string,
  data: UpdateLessonRequest
): Promise<LessonResponse> {
  return patch<LessonResponse>(`/instructor/lessons/${lessonId}`, data);
}

export async function deleteLesson(
  lessonId: string
): Promise<{ message?: string }> {
  return del<{ message?: string }>(`/instructor/lessons/${lessonId}`);
}
