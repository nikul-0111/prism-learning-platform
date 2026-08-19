import { HelpCircle } from "lucide-react";

export default function FaqHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
          <HelpCircle className="h-7 w-7 text-indigo-400" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-400">
          Help Center
        </p>

        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Find quick answers to common questions about your PRISM account,
          courses, and platform experience.
        </p>
      </div>
    </section>
  );
}