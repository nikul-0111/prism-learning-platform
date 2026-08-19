export interface CreateCourseInput {
  title: string;
  shortDescription?: string;
  description: string;
  category?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: number;
  thumbnail?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface UpdateCourseInput {
  title?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price?: number;
  thumbnail?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export function validateCreateCourse(data: unknown): CreateCourseInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const body = data as Record<string, unknown>;

  if (typeof body.title !== "string" || body.title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters");
  }

  const desc = typeof body.description === "string" && body.description.trim()
    ? body.description.trim()
    : typeof body.shortDescription === "string"
    ? body.shortDescription.trim()
    : "";

  if (!desc || desc.length < 5) {
    throw new Error("Description must be at least 5 characters");
  }

  if (typeof body.price !== "number" || body.price < 0) {
    throw new Error("Price must be a valid positive number");
  }

  const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const level = typeof body.level === "string" && validLevels.includes(body.level.toUpperCase())
    ? (body.level.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")
    : "BEGINNER";

  const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  const status = typeof body.status === "string" && validStatuses.includes(body.status.toUpperCase())
    ? (body.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED")
    : "DRAFT";

  return {
    title: body.title.trim(),
    shortDescription: typeof body.shortDescription === "string" ? body.shortDescription.trim() : undefined,
    description: desc,
    category: typeof body.category === "string" ? body.category.trim() : undefined,
    level,
    price: body.price,
    thumbnail: typeof body.thumbnail === "string" ? body.thumbnail.trim() : undefined,
    status,
  };
}

export function validateUpdateCourse(data: unknown): UpdateCourseInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const body = data as Record<string, unknown>;
  const result: UpdateCourseInput = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters");
    }
    result.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.trim().length < 5) {
      throw new Error("Description must be at least 5 characters");
    }
    result.description = body.description.trim();
  }

  if (body.shortDescription !== undefined) {
    result.shortDescription = typeof body.shortDescription === "string" ? body.shortDescription.trim() : undefined;
  }

  if (body.category !== undefined) {
    result.category = typeof body.category === "string" ? body.category.trim() : undefined;
  }

  if (body.price !== undefined) {
    if (typeof body.price !== "number" || body.price < 0) {
      throw new Error("Price must be a valid positive number");
    }
    result.price = body.price;
  }

  if (body.thumbnail !== undefined) {
    result.thumbnail = typeof body.thumbnail === "string" ? body.thumbnail.trim() : undefined;
  }

  if (body.level !== undefined) {
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    if (typeof body.level === "string" && validLevels.includes(body.level.toUpperCase())) {
      result.level = body.level.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    }
  }

  if (body.status !== undefined) {
    const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (typeof body.status === "string" && validStatuses.includes(body.status.toUpperCase())) {
      result.status = body.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    }
  }

  return result;
}