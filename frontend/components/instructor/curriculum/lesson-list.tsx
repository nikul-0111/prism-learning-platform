"use client";

import { useEffect, useState } from "react";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  Lesson,
  CreateLessonRequest,
  LessonType,
} from "@/lib/api/instructor-lesson.api";
import { saveQuiz, getQuiz, QuizData } from "@/lib/api/instructor-quiz.api";
import LessonItem from "./lesson-item";
import AddLesson from "./add-lesson";
import LessonPreviewModal from "./lesson-preview-modal";

interface LessonListProps {
  sectionId: string;
  initialShowAddForm?: boolean;
  initialType?: LessonType;
  onAddFormClosed?: () => void;
}

export default function LessonList({
  sectionId,
  initialShowAddForm = false,
  initialType = "VIDEO",
  onAddFormClosed,
}: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  const [selectedType, setSelectedType] = useState<LessonType>(initialType);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizData | null>(null);
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (initialShowAddForm) {
      setShowAddForm(true);
      setSelectedType(initialType);
    }
  }, [initialShowAddForm, initialType]);

  useEffect(() => {
    if (!sectionId) return;

    async function loadLessons() {
      try {
        setLoading(true);
        const response = await getLessons(sectionId);
        if (response?.data?.lessons) {
          setLessons(response.data.lessons);
        }
      } catch {
        // Local fallback
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [sectionId]);

  function handleCancelAdd() {
    setShowAddForm(false);
    onAddFormClosed?.();
  }

  async function startEditLesson(lesson: Lesson) {
    let quizData: QuizData | null = null;

    if (lesson.type === "QUIZ") {
      try {
        const res = await getQuiz(lesson.id);
        if (res?.data?.quiz) {
          quizData = res.data.quiz;
        }
      } catch {
        // Graceful error fallback
      }
    }

    setEditingQuiz(quizData);
    setEditingLesson(lesson);
  }

  async function handleCreateLesson(data: CreateLessonRequest) {
    try {
      const res = await createLesson(sectionId, data);
      let created = res?.data?.lesson;

      if (created && data.type === "QUIZ" && data.quizData) {
        try {
          const quizRes = await saveQuiz(created.id, data.quizData);
          if (quizRes?.data?.quiz) {
            created = { ...created, quizId: quizRes.data.quiz.id };
          }
        } catch (quizErr) {
          console.error("Failed to save quiz data:", quizErr);
        }
      }

      if (created) {
        setLessons((prev) => [...prev, created!]);
      } else {
        setLessons((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sectionId,
            title: data.title,
            type: data.type || selectedType,
            videoUrl: data.videoUrl,
            content: data.content,
            duration: data.duration,
            isFreePreview: data.isFreePreview,
          },
        ]);
      }
    } catch {
      setLessons((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sectionId,
          title: data.title,
          type: data.type || selectedType,
          videoUrl: data.videoUrl,
          content: data.content,
          duration: data.duration,
          isFreePreview: data.isFreePreview,
        },
      ]);
    } finally {
      handleCancelAdd();
    }
  }

  async function handleUpdateLesson(data: CreateLessonRequest) {
    if (!editingLesson) return;

    try {
      const res = await updateLesson(editingLesson.id, data);
      let updated = res?.data?.lesson;

      if (data.type === "QUIZ" && data.quizData) {
        try {
          const quizRes = await saveQuiz(editingLesson.id, data.quizData);
          if (quizRes?.data?.quiz && updated) {
            updated = { ...updated, quizId: quizRes.data.quiz.id };
          }
        } catch (quizErr) {
          console.error("Failed to save quiz data:", quizErr);
        }
      }

      setLessons((prev) =>
        prev.map((l) =>
          l.id === editingLesson.id
            ? { ...l, ...data, title: updated?.title || data.title, quizId: updated?.quizId || l.quizId }
            : l
        )
      );
    } catch {
      setLessons((prev) =>
        prev.map((l) => (l.id === editingLesson.id ? { ...l, ...data } : l))
      );
    } finally {
      setEditingLesson(null);
      setEditingQuiz(null);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch {
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    }
  }

  return (
    <div className="space-y-3 pt-1">
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, idx) =>
            editingLesson?.id === lesson.id ? (
              <AddLesson
                key={lesson.id}
                sectionId={sectionId}
                initialData={{
                  title: lesson.title,
                  description: lesson.description || undefined,
                  type: lesson.type,
                  videoUrl: lesson.videoUrl || undefined,
                  content: lesson.content || undefined,
                  duration: lesson.duration,
                  isFreePreview: lesson.isFreePreview,
                  passMark: editingQuiz?.passMark,
                  timeLimit: editingQuiz?.timeLimit,
                  maxAttempts: editingQuiz?.maxAttempts,
                  questions: editingQuiz?.questions,
                }}
                onSave={handleUpdateLesson}
                onCancel={() => {
                  setEditingLesson(null);
                  setEditingQuiz(null);
                }}
              />
            ) : (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                index={idx}
                onEdit={startEditLesson}
                onDelete={handleDeleteLesson}
                onView={(lessonToView) => setViewingLesson(lessonToView)}
              />
            )
          )}

          {/* Add Item Creator Form */}
          {showAddForm && (
            <AddLesson
              sectionId={sectionId}
              initialData={{
                title: "",
                type: selectedType,
              }}
              onSave={handleCreateLesson}
              onCancel={handleCancelAdd}
            />
          )}
        </div>
      )}

      {/* Lesson Preview Modal */}
      {viewingLesson && (
        <LessonPreviewModal
          lesson={viewingLesson}
          onClose={() => setViewingLesson(null)}
          onEdit={(lessonToEdit) => {
            setViewingLesson(null);
            startEditLesson(lessonToEdit);
          }}
        />
      )}
    </div>
  );
}
