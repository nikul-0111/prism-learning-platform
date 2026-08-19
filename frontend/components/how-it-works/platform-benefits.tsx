import {
  Accessibility,
  BookOpen,
  Monitor,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Monitor,
    title: "Learn Anywhere",
    description:
      "Access your learning experience from your computer or other supported devices.",
  },
  {
    icon: BookOpen,
    title: "Structured Learning",
    description:
      "Follow organized courses that help you progress from one topic to the next.",
  },
  {
    icon: Smartphone,
    title: "Flexible Experience",
    description:
      "Fit learning into your schedule and return to your courses whenever you need.",
  },
  {
    icon: Users,
    title: "Learner Focused",
    description:
      "Designed around a simple and accessible experience for students.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Your account and learning information are handled through a secure platform.",
  },
  {
    icon: Accessibility,
    title: "Easy to Use",
    description:
      "Simple navigation helps you focus on learning rather than figuring out the platform.",
  },
];

export default function PlatformBenefits() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Why PRISM
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Built around your learning experience
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Everything is designed to make online learning clearer, simpler,
            and more engaging.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-indigo-50 p-3">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}