import type {
  CreateLessonInput,
  UpdateLessonInput,
  LessonType,
} from "./lesson.types.js";

const VALID_LESSON_TYPES: LessonType[] = ["VIDEO", "ARTICLE", "QUIZ", "FILE"];

export function validateCreateLesson(data: CreateLessonInput): CreateLessonInput {
  const title = data.title?.trim();

  if (!title) {
    throw new Error("Lesson title is required.");
  }

  if (title.length > 200) {
    throw new Error("Lesson title must be less than 200 characters.");
  }

  const type = data.type && VALID_LESSON_TYPES.includes(data.type)
    ? data.type
    : "VIDEO";

  return {
    title,
    description: data.description?.trim() || undefined,
    type,
    videoUrl: data.videoUrl?.trim() || undefined,
    content: data.content?.trim() || undefined,
    duration: typeof data.duration === "number" && data.duration >= 0 ? data.duration : 0,
    isFreePreview: Boolean(data.isFreePreview),
  };
}

export function validateUpdateLesson(data: UpdateLessonInput): UpdateLessonInput {
  const result: UpdateLessonInput = {};

  if (data.title !== undefined) {
    const title = data.title.trim();
    if (!title) {
      throw new Error("Lesson title cannot be empty.");
    }
    if (title.length > 200) {
      throw new Error("Lesson title must be less than 200 characters.");
    }
    result.title = title;
  }

  if (data.description !== undefined) {
    result.description = data.description.trim() || undefined;
  }

  if (data.type !== undefined && VALID_LESSON_TYPES.includes(data.type)) {
    result.type = data.type;
  }

  if (data.videoUrl !== undefined) {
    result.videoUrl = data.videoUrl.trim() || undefined;
  }

  if (data.content !== undefined) {
    result.content = data.content.trim() || undefined;
  }

  if (typeof data.duration === "number" && data.duration >= 0) {
    result.duration = data.duration;
  }

  if (typeof data.position === "number") {
    result.position = data.position;
  }

  if (typeof data.isFreePreview === "boolean") {
    result.isFreePreview = data.isFreePreview;
  }

  return result;
}
