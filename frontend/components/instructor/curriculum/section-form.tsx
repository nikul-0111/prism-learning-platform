"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

interface SectionFormProps {
  open: boolean;
  initialTitle?: string;
  initialDescription?: string | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
  }) => void;
}

export default function SectionForm({
  open,
  initialTitle = "",
  initialDescription = "",
  loading = false,
  onClose,
  onSubmit,
}: SectionFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(
    initialDescription ?? ""
  );

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription ?? "");
  }, [initialTitle, initialDescription, open]);

  if (!open) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    onSubmit({
      title: cleanTitle,
      description: description.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initialTitle ? "Edit Section" : "Create Section"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a section to your course curriculum.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Section Title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Introduction to React"
              required
              className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what students will learn..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialTitle
                  ? "Update Section"
                  : "Create Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}