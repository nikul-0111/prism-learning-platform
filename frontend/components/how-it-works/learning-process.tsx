import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  LineChart,
} from "lucide-react";

const process = [
  {
    icon: BookOpen,
    title: "Discover",
    description:
      "Browse our collection of courses and find learning content that matches your goals.",
  },
  {
    icon: GraduationCap,
    title: "Learn",
    description:
      "Study lessons, watch videos, and build your knowledge step by step.",
  },
  {
    icon: CheckCircle,
    title: "Practice",
    description:
      "Test your understanding through assessments and practical learning activities.",
  },
  {
    icon: LineChart,
    title: "Grow",
    description:
      "Track your progress, complete courses, and continue improving your skills.",
  },
];

export default function LearningProcess() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            How PRISM Works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your learning journey made simple
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            PRISM gives you everything you need to turn your learning goals
            into meaningful progress.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-indigo-50 p-3">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>

                  <span className="text-4xl font-bold text-slate-100">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}