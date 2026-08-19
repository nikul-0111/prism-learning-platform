export type LessonType = "VIDEO" | "ARTICLE" | "QUIZ" | "FILE";

export interface CreateLessonInput {
  title: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  duration?: number;
  isFreePreview?: boolean;
}

export interface UpdateLessonInput {
  title?: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  duration?: number;
  position?: number;
  isFreePreview?: boolean;
}
