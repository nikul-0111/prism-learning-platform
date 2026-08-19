"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I find a course?",
    answer:
      "Visit the Courses section to browse available courses and use the available search and filtering options to find suitable content.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "Open the course you are interested in and select the enrollment option available on its course page.",
  },
  {
    question: "Can I leave a course and return later?",
    answer:
      "Yes. Your enrolled courses can be accessed again through your learning area, allowing you to continue your learning journey.",
  },
  {
    question: "Can I enroll in multiple courses?",
    answer:
      "Yes, you can enroll in multiple courses when they are available to your account.",
  },
];

export default function CourseFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Courses
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Courses & enrollment
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 pb-5 pt-4">
                    <p className="leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}