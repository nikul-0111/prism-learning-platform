"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCourseById, updateCourse } from "@/lib/api/instructor-course.api";
import CourseBasicInfo from "@/components/instructor/course-form/course-basic-info";
import CourseDescription from "@/components/instructor/course-form/course-description";
import CourseCategory from "@/components/instructor/course-form/course-category";
import CourseLevel from "@/components/instructor/course-form/course-level";
import CoursePrice from "@/components/instructor/course-form/course-price";
import CourseThumbnail from "@/components/instructor/course-form/course-thumbnail";
import CoursePublishSettings from "@/components/instructor/course-form/course-publish-settings";

import Link from "next/link";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [price, setPrice] = useState("0");
  const [thumbnail, setThumbnail] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!courseId) return;

    async function loadCourse() {
      try {
        setInitialLoading(true);
        setError("");
        const res = await getCourseById(courseId);

        if (res?.course) {
          const c = res.course;
          setTitle(c.title || "");
          setShortDescription(c.shortDescription || "");
          setDescription(c.description || "");
          setCategory(c.category || "");
          setLevel((c.level || "BEGINNER").toUpperCase());
          setPrice(String(c.price !== undefined ? c.price : 0));
          setThumbnail(c.thumbnail || "");
          setStatus((c.status || "DRAFT").toUpperCase());
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch course details.");
        }
      } finally {
        setInitialLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Course title is required.");
      return;
    }

    const desc = description.trim() || shortDescription.trim();
    if (!desc || desc.length < 5) {
      setError("Course description must be at least 5 characters.");
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setSubmitting(true);

      const updateData = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: desc,
        category,
        level,
        price: numericPrice,
        thumbnail: thumbnail.trim() || undefined,
        status,
      };

      const response = await updateCourse(courseId, updateData);

      setSuccess(response.message || "Course updated successfully!");

      setTimeout(() => {
        router.push("/instructor/courses");
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to update course. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Course
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update your course details, pricing, level, and publication status.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-6 flex border-b border-slate-200">
            <Link
              href={`/instructor/courses/${courseId}/edit`}
              className="border-b-2 border-indigo-600 pb-3 px-4 text-sm font-semibold text-indigo-600"
            >
              Course Details
            </Link>
            <Link
              href={`/instructor/courses/${courseId}/curriculum`}
              className="border-b-2 border-transparent pb-3 px-4 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Curriculum Builder
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <CourseBasicInfo
            title={title}
            shortDescription={shortDescription}
            onTitleChange={setTitle}
            onShortDescriptionChange={setShortDescription}
          />

          <CourseDescription
            description={description}
            onDescriptionChange={setDescription}
          />

          <CourseCategory
            category={category}
            onCategoryChange={setCategory}
          />

          <CourseLevel
            level={level}
            onLevelChange={setLevel}
          />

          <CoursePrice
            price={price}
            onPriceChange={setPrice}
          />

          <CourseThumbnail
            thumbnail={thumbnail}
            onThumbnailChange={setThumbnail}
          />

          <CoursePublishSettings
            status={status}
            onStatusChange={setStatus}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 rounded-xl border border-slate-200 bg-white p-6">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
