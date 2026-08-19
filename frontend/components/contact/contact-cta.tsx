import Link from "next/link";
import { ArrowRight, BookOpen, HelpCircle } from "lucide-react";

export default function ContactCta() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-14 text-center shadow-2xl sm:px-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <BookOpen className="h-6 w-6 text-white" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="mt-7 text-3xl font-bold text-white sm:text-4xl">
              We're ready to help you learn
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
              Find answers, explore courses, or get in touch with the PRISM
              support team whenever you need assistance.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Visit FAQ
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}