import { get, post, patch, del } from "./client";

export interface Section {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSectionRequest {
  title: string;
  description?: string;
}

export interface UpdateSectionRequest {
  title?: string;
  description?: string;
  position?: number;
}

export interface SectionsResponse {
  message?: string;
  data: {
    sections: Section[];
  };
}

export interface SectionResponse {
  message?: string;
  data: {
    section: Section;
  };
}

/**
 * Get all sections for a course
 */
export async function getSections(
  courseId: string
): Promise<SectionsResponse> {
  return get<SectionsResponse>(
    `/instructor/courses/${courseId}/sections`
  );
}

/**
 * Create a section
 */
export async function createSection(
  courseId: string,
  data: CreateSectionRequest
): Promise<SectionResponse> {
  return post<SectionResponse>(
    `/instructor/courses/${courseId}/sections`,
    data
  );
}

/**
 * Update a section
 */
export async function updateSection(
  sectionId: string,
  data: UpdateSectionRequest
): Promise<SectionResponse> {
  return patch<SectionResponse>(
    `/instructor/sections/${sectionId}`,
    data
  );
}

/**
 * Delete a section
 */
export async function deleteSection(
  sectionId: string
): Promise<{ message?: string }> {
  return del<{ message?: string }>(
    `/instructor/sections/${sectionId}`
  );
}