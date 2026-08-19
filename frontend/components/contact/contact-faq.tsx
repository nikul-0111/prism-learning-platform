import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

const questions = [
  "How quickly will I receive a response?",
  "What information should I include in my message?",
  "Where can I find answers to common questions?",
];

export default function ContactFaq() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <HelpCircle className="h-7 w-7 text-indigo-600" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Quick Answers
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Have you checked our FAQ?
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            You may find the answer to your question without needing to
            contact support.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {questions.map((question) => (
            <div
              key={question}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-5"
            >
              <p className="font-semibold text-slate-800">{question}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            View all frequently asked questions
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}