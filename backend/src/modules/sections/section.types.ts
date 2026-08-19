export interface CreateSectionInput {
  title: string;
  description?: string;
}

export interface UpdateSectionInput {
  title?: string;
  description?: string;
  position?: number;
}
