"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I create a PRISM account?",
    answer:
      "Select the registration option and provide the required information to create your learner account.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Use the password reset option on the login page and follow the instructions provided to create a new password.",
  },
  {
    question: "Can I update my account information?",
    answer:
      "Yes. Once logged in, you can manage the account information available through your profile settings.",
  },
  {
    question: "How do I log out?",
    answer:
      "Open your account menu and select the logout option to securely end your current session.",
  },
];

export default function AccountFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Account
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Account & access
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