import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function FaqCta() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-14 text-center shadow-2xl sm:px-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <BookOpen className="h-7 w-7 text-white" />
            </div>

            <h2 className="mt-7 text-3xl font-bold text-white sm:text-4xl">
              Ready to start learning?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
              Explore available courses and find your next learning
              opportunity with PRISM.
            </p>

            <Link
              href="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Explore Courses
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}