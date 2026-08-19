"use client";

import SectionItem from "./section-item";

import type { Section } from "@/lib/api/instructor-section.api";

interface SectionListProps {
  sections: Section[];
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
  onAddLesson: (section: Section) => void;
}

export default function SectionList({
  sections,
  onEdit,
  onDelete,
  onAddLesson,
}: SectionListProps) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          section={section}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddLesson={onAddLesson}
        />
      ))}
    </div>
  );
}