import {
  ArrowDown,
  Check,
  Compass,
  GraduationCap,
  Play,
  Trophy,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up for PRISM and create your personal learning profile.",
  },
  {
    icon: Compass,
    title: "Choose a course",
    description:
      "Explore available courses and select one that matches your learning goals.",
  },
  {
    icon: Play,
    title: "Start learning",
    description:
      "Access lessons, videos, and learning materials directly from your course.",
  },
  {
    icon: GraduationCap,
    title: "Complete assessments",
    description:
      "Take quizzes and assessments to check your understanding.",
  },
  {
    icon: Trophy,
    title: "Earn your certificate",
    description:
      "Successfully complete your course and receive your learning certificate.",
  },
];

export default function StepByStep() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Step by Step
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            From signup to achievement
          </h2>
        </div>

        <div className="mt-14">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title}>
                <div className="flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-indigo-600">
                        STEP {index + 1}
                      </span>

                      {index < 2 && (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          Easy Start
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  <Check className="hidden h-5 w-5 text-green-500 sm:block" />
                </div>

                {index < steps.length - 1 && (
                  <div className="flex justify-center py-3">
                    <ArrowDown className="h-5 w-5 text-slate-300" />
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