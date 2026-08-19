import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HowItWorksCta() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-14 text-center shadow-2xl sm:px-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles className="h-7 w-7 text-white" />
            </div>

            <h2 className="mt-7 text-3xl font-bold text-white sm:text-4xl">
              Ready to start your learning journey?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
              Explore PRISM courses, choose your learning path, and start
              building skills that move you forward.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}