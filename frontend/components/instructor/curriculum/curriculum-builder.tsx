"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, BookOpen, ArrowLeft, Edit2, Trash2, Check, X, ChevronDown, ChevronRight, Layers, Video, FileText, HelpCircle, File, MoreVertical } from "lucide-react";
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  Section as APISection,
} from "@/lib/api/instructor-section.api";
import { LessonType } from "@/lib/api/instructor-lesson.api";
import LessonList from "./lesson-list";

interface CurriculumBuilderProps {
  courseId: string;
  courseTitle: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
}

export default function CurriculumBuilder({
  courseId,
  courseTitle,
}: CurriculumBuilderProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Accordion open/close section state
  const [openSectionIds, setOpenSectionIds] = useState<string[]>([]);

  // Trigger add lesson state per section with selected type
  const [addingLessonState, setAddingLessonState] = useState<{
    sectionId: string;
    type: LessonType;
  } | null>(null);

  // New section form state
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");

  // Edit section state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete section loading state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Three-dot popover menu state
  const [openMenuSectionId, setOpenMenuSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function loadSections() {
      try {
        setLoading(true);
        const response = await getSections(courseId);
        if (response?.data?.sections) {
          const fetched = response.data.sections.map((s: APISection) => ({
            id: s.id,
            title: s.title,
            description: s.description || "",
          }));
          setSections(fetched);
          // By default open all sections
          setOpenSectionIds(fetched.map((s: Section) => s.id));
        }
      } catch {
        // Fallback gracefully if API is not live
      } finally {
        setLoading(false);
      }
    }

    loadSections();
  }, [courseId]);

  // Toggle section open/close
  function toggleSectionOpen(sectionId: string) {
    setOpenSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }

  // Trigger add lesson form for a specific section and type
  function triggerAddLesson(sectionId: string, type: LessonType, e: React.MouseEvent) {
    e.stopPropagation();
    if (!openSectionIds.includes(sectionId)) {
      setOpenSectionIds((prev) => [...prev, sectionId]);
    }
    setAddingLessonState({ sectionId, type });
  }

  // Create section
  async function handleCreateSection() {
    if (!sectionTitle.trim()) {
      return;
    }

    const title = sectionTitle.trim();
    const description = sectionDescription.trim();

    try {
      setSaving(true);
      const response = await createSection(courseId, {
        title,
        description: description || undefined,
      });

      if (response?.data?.section) {
        const s = response.data.section;
        const newSec = {
          id: s.id,
          title: s.title,
          description: s.description || "",
        };
        setSections((prev) => [...prev, newSec]);
        setOpenSectionIds((prev) => [...prev, s.id]);
      } else {
        // Local fallback
        const newId = crypto.randomUUID();
        setSections((prev) => [
          ...prev,
          { id: newId, title, description },
        ]);
        setOpenSectionIds((prev) => [...prev, newId]);
      }
    } catch {
      // Local fallback on API failure
      const newId = crypto.randomUUID();
      setSections((prev) => [
        ...prev,
        { id: newId, title, description },
      ]);
      setOpenSectionIds((prev) => [...prev, newId]);
    } finally {
      setSaving(false);
      setSectionTitle("");
      setSectionDescription("");
      setShowSectionForm(false);
    }
  }

  // Start editing section
  function startEditSection(section: Section, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingSectionId(section.id);
    setEditTitle(section.title);
    setEditDescription(section.description);
  }

  // Cancel edit
  function cancelEditSection() {
    setEditingSectionId(null);
    setEditTitle("");
    setEditDescription("");
  }

  // Update section
  async function handleUpdateSection(sectionId: string) {
    if (!editTitle.trim()) return;

    const title = editTitle.trim();
    const description = editDescription.trim();

    try {
      setUpdating(true);
      const response = await updateSection(sectionId, {
        title,
        description,
      });

      const updated = response?.data?.section;
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                title: updated?.title || title,
                description: updated?.description || description,
              }
            : s
        )
      );
    } catch {
      // Fallback local state update
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                title,
                description,
              }
            : s
        )
      );
    } finally {
      setUpdating(false);
      setEditingSectionId(null);
    }
  }

  // Delete section
  async function handleDeleteSection(sectionId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this section?")) {
      return;
    }

    try {
      setDeletingId(sectionId);
      await deleteSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    } catch {
      // Local fallback removal
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Navigation back */}
        <div className="mb-4">
          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Courses
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-indigo-600">
                Course Curriculum Builder
              </p>

              <h1 className="text-2xl font-extrabold text-slate-900">
                {courseTitle}
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex border-b border-slate-200">
            <Link
              href={`/instructor/courses/${courseId}/edit`}
              className="border-b-2 border-transparent pb-3 px-4 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Course Details
            </Link>
            <Link
              href={`/instructor/courses/${courseId}/curriculum`}
              className="border-b-2 border-indigo-600 pb-3 px-4 text-sm font-semibold text-indigo-600"
            >
              Curriculum Builder
            </Link>
          </div>
        </div>

        {/* Curriculum Container */}
        <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm transition-all ${openMenuSectionId ? "overflow-visible" : "overflow-hidden"}`}>
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  Course Structure
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500 font-medium">
                {sections.length} Section{sections.length !== 1 ? "s" : ""} Total
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSectionForm(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </button>
          </div>

          {/* Add Section Form */}
          {showSectionForm && (
            <div className="border-b border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                Create New Section
              </h3>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(event) =>
                      setSectionTitle(event.target.value)
                    }
                    placeholder="e.g. Section 1: Introduction & Fundamentals"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Section Objective / Description
                  </label>
                  <textarea
                    value={sectionDescription}
                    onChange={(event) =>
                      setSectionDescription(event.target.value)
                    }
                    placeholder="Brief summary of what students learn in this section..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSectionForm(false);
                      setSectionTitle("");
                      setSectionDescription("");
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleCreateSection}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Section"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sections List Accordion */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : sections.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                  <BookOpen className="h-7 w-7 text-indigo-600" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No sections yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                  Start building your course structure by adding your first section.
                </p>

                <button
                  type="button"
                  onClick={() => setShowSectionForm(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add First Section
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, index) => {
                  const isOpen = openSectionIds.includes(section.id);
                  const isMenuOpen = openMenuSectionId === section.id;
                  const isLastSection = sections.length > 1 && index >= sections.length - 1;

                  return (
                    <div
                      key={section.id}
                      className={`rounded-2xl border border-slate-200 bg-white transition duration-200 shadow-sm ${
                        isMenuOpen ? "relative z-30 overflow-visible" : "overflow-hidden"
                      }`}
                    >
                      {/* Section Accordion Header */}
                      {editingSectionId === section.id ? (
                        <div className="bg-slate-50 p-5 border-b border-slate-200">
                          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Edit Section {index + 1}
                          </h4>

                          <div className="space-y-3 max-w-xl">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              placeholder="Section Title"
                            />

                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={2}
                              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              placeholder="Section Description"
                            />

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={cancelEditSection}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                              </button>

                              <button
                                type="button"
                                disabled={updating}
                                onClick={() => handleUpdateSection(section.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                                {updating ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => toggleSectionOpen(section.id)}
                          className="flex cursor-pointer items-center justify-between bg-slate-50/70 px-5 py-4 transition hover:bg-slate-100/80"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="text-slate-400 hover:text-slate-700"
                            >
                              {isOpen ? (
                                <ChevronDown className="h-5 w-5 text-indigo-600" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                                  Section {index + 1}:
                                </span>
                                <h3 className="text-sm font-extrabold text-slate-900">
                                  {section.title}
                                </h3>
                              </div>

                              {section.description && (
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {section.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Three Dots Action Popover Menu */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuSectionId(isMenuOpen ? null : section.id);
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition shadow-xs cursor-pointer"
                              title="Section Options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {/* Backdrop to close menu when clicking outside */}
                            {isMenuOpen && (
                              <div
                                className="fixed inset-0 z-20 cursor-default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuSectionId(null);
                                }}
                              />
                            )}

                            {/* Three-Dot Floating Popover Menu */}
                            {isMenuOpen && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className={`absolute right-0 z-40 w-56 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100 ${
                                  isLastSection ? "bottom-11" : "top-11"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setOpenMenuSectionId(null);
                                    triggerAddLesson(section.id, "VIDEO", e);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer"
                                >
                                  <Video className="h-4 w-4 text-purple-600 shrink-0" />
                                  <span>+ Add Video Lecture</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setOpenMenuSectionId(null);
                                    triggerAddLesson(section.id, "ARTICLE", e);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                                >
                                  <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                                  <span>+ Add Article Reading</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setOpenMenuSectionId(null);
                                    triggerAddLesson(section.id, "QUIZ", e);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition cursor-pointer"
                                >
                                  <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                  <span>+ Add Quiz Assessment</span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setOpenMenuSectionId(null);
                                    startEditSection(section, e);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                                >
                                  <Edit2 className="h-4 w-4 text-indigo-600 shrink-0" />
                                  <span>Edit Section Title</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={deletingId === section.id}
                                  onClick={(e) => {
                                    setOpenMenuSectionId(null);
                                    handleDeleteSection(section.id, e);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600 shrink-0" />
                                  <span>{deletingId === section.id ? "Deleting..." : "Delete Section"}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Collapsible Section Lessons Container */}
                      {isOpen && (
                        <div className="border-t border-slate-200 bg-white p-5">
                          <LessonList
                            sectionId={section.id}
                            initialShowAddForm={addingLessonState?.sectionId === section.id}
                            initialType={addingLessonState?.sectionId === section.id ? addingLessonState.type : "VIDEO"}
                            onAddFormClosed={() => setAddingLessonState(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}