import {
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: HelpCircle,
    title: "Practice questions",
    description: "Test your understanding after learning each topic.",
  },
  {
    icon: ClipboardCheck,
    title: "Course assessments",
    description: "Complete assessments designed around your course content.",
  },
  {
    icon: Trophy,
    title: "Measure achievement",
    description: "Use your results to understand your learning progress.",
  },
];

export default function Assessments() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Practice & Assess
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Turn knowledge into confidence
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Assessments help you check what you have learned and identify
              areas where you can improve.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <div className="rounded-xl bg-indigo-500/10 p-3">
                      <Icon className="h-6 w-6 text-indigo-400" />
                    </div>

                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Assessment</p>
                  <h3 className="mt-1 text-xl font-bold">
                    JavaScript Fundamentals
                  </h3>
                </div>

                <ClipboardCheck className="h-7 w-7 text-indigo-600" />
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Question 8 of 10</span>
                  <span className="text-slate-500">80%</span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-4/5 rounded-full bg-indigo-600" />
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="font-semibold">
                  Which keyword is used to declare a constant in JavaScript?
                </p>

                <div className="mt-5 space-y-3">
                  {["var", "let", "const", "static"].map((answer, index) => (
                    <div
                      key={answer}
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        index === 2
                          ? "border-green-200 bg-green-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="text-sm font-medium">{answer}</span>

                      {index === 2 && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
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