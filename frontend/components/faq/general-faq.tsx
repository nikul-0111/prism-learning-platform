"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is PRISM?",
    answer:
      "PRISM is a learning platform that helps students discover courses, manage their learning, and build their skills through structured online education.",
  },
  {
    question: "Who can use PRISM?",
    answer:
      "PRISM is designed for students and learners who want to access structured educational content and develop new skills.",
  },
  {
    question: "Do I need an account to use PRISM?",
    answer:
      "You can explore public areas of the platform without an account. An account is required for features such as enrolling in courses and managing your personal learning experience.",
  },
  {
    question: "How can I get help if I have a question?",
    answer:
      "You can use the FAQ page to find answers to common questions or contact the PRISM support team if you need additional assistance.",
  },
];

export default function GeneralFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            General
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            General questions
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