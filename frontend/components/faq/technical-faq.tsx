"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Which browser should I use?",
    answer:
      "For the best experience, use a modern and up-to-date browser such as Chrome, Edge, Firefox, or Safari.",
  },
  {
    question: "What should I do if a page does not load?",
    answer:
      "Try refreshing the page, checking your internet connection, or opening PRISM in an updated browser.",
  },
  {
    question: "What if a video does not play?",
    answer:
      "Check your internet connection, refresh the page, and make sure your browser is updated. If the issue continues, contact support.",
  },
  {
    question: "How do I report a technical problem?",
    answer:
      "Contact the PRISM support team and provide details about the issue, including what you were trying to do and any error message you received.",
  },
];

export default function TechnicalFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Technical
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Platform & technical help
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