"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createCourse } from "@/lib/api/instructor-course.api";

import CourseBasicInfo from "./course-basic-info";
import CourseDescription from "./course-description";
import CourseCategory from "./course-category";
import CourseLevel from "./course-level";
import CoursePrice from "./course-price";
import CourseThumbnail from "./course-thumbnail";
import CoursePublishSettings from "./course-publish-settings";

export default function CourseForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [price, setPrice] = useState("0");
  const [thumbnail, setThumbnail] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!shortDescription.trim()) {
      setError("Short description is required.");
      return;
    } 
      
    //  ADD THIS CHECK:
    if (!description.trim() || description.trim().length < 10) {
      setError("Full course description must be at least 10 characters.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!level) {
      setError("Please select a level.");
      return;
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      // Data that will be sent to backend
      const courseData = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        category,
        level,
        price: numericPrice,
        thumbnail: thumbnail.trim() || undefined,
        status,
      };

      console.log("Sending course data:", courseData);

      // ACTUAL BACKEND API CALL
      const response = await createCourse(courseData);

      console.log("Create course response:", response);

      setSuccess(response.message || "Course created successfully.");

      // Move to course list after successful creation
      setTimeout(() => {
        router.push("/instructor/courses");
      }, 800);
    } catch (err: unknown) {
      console.error("Create course error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create course. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create New Course
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create the basic information for your course.
          </p>
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

          {/* Basic Information */}
          <CourseBasicInfo
            title={title}
            shortDescription={shortDescription}
            onTitleChange={setTitle}
            onShortDescriptionChange={setShortDescription}
          />

          {/* Description */}
          <CourseDescription
            description={description}
            onDescriptionChange={setDescription}
          />

          {/* Category */}
          <CourseCategory
            category={category}
            onCategoryChange={setCategory}
          />

          {/* Level */}
          <CourseLevel
            level={level}
            onLevelChange={setLevel}
          />

          {/* Price */}
          <CoursePrice
            price={price}
            onPriceChange={setPrice}
          />

          {/* Thumbnail */}
          <CourseThumbnail
            thumbnail={thumbnail}
            onThumbnailChange={setThumbnail}
          />

          {/* Publish Settings */}
          <CoursePublishSettings
            status={status}
            onStatusChange={setStatus}
          />

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 rounded-xl border border-slate-200 bg-white p-6">

            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}