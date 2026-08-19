import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Simple. Flexible. Effective.
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn smarter with{" "}
              <span className="text-indigo-400">PRISM</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Discover courses, learn at your own pace, practice your skills,
              track your progress, and earn certificates—all in one learning
              platform.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-500"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-900"
              >
                <PlayCircle className="h-5 w-5" />
                Learn About PRISM
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-6 text-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100 p-3">
                      <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>

                    <div>
                      <p className="font-semibold">Your Learning Journey</p>
                      <p className="text-sm text-slate-500">
                        Keep growing every day
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  {[
                    ["Discover", "Find the right course", true],
                    ["Learn", "Watch lessons and study", true],
                    ["Practice", "Complete assessments", true],
                    ["Achieve", "Earn your certificate", false],
                  ].map(([title, description, completed], index) => (
                    <div key={String(title)} className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          completed
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}