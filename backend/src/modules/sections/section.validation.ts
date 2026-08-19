import type {
  CreateSectionInput,
  UpdateSectionInput,
} from "./section.types.js";

export function validateCreateSection(
  data: CreateSectionInput,
): CreateSectionInput {
  const title = data.title?.trim();

  if (!title) {
    throw new Error("Section title is required.");
  }

  if (title.length > 200) {
    throw new Error("Section title must be less than 200 characters.");
  }

  return {
    title,
    description: data.description?.trim() || undefined,
  };
}

export function validateUpdateSection(
  data: UpdateSectionInput,
): UpdateSectionInput {
  if (data.title !== undefined) {
    const title = data.title.trim();

    if (!title) {
      throw new Error("Section title cannot be empty.");
    }

    if (title.length > 200) {
      throw new Error(
        "Section title must be less than 200 characters.",
      );
    }

    return {
      ...data,
      title,
      description: data.description?.trim(),
    };
  }

  return {
    ...data,
    description: data.description?.trim(),
  };
}