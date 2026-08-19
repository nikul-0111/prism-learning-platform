import { BarChart3, CheckCircle2, Clock3, TrendingUp } from "lucide-react";

export default function ProgressTracking() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Track Your Progress
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Always know how far you have come
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Your learning dashboard helps you see completed lessons,
              assessment results, course progress, and your overall learning
              journey.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Course Progress", "85%"],
                ["Lessons Complete", "32"],
                ["Assessments", "8"],
                ["Learning Hours", "24h"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Learning Dashboard</p>
                <h3 className="mt-1 text-2xl font-bold">Your Progress</h3>
              </div>

              <BarChart3 className="h-7 w-7 text-indigo-400" />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm">
                <span>Full Stack Development</span>
                <span className="text-indigo-400">75%</span>
              </div>

              <div className="mt-3 h-3 rounded-full bg-slate-800">
                <div className="h-full w-3/4 rounded-full bg-indigo-500" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-slate-900 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <div className="flex-1">
                  <p className="font-medium">React Fundamentals</p>
                  <p className="text-sm text-slate-400">Completed</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-slate-900 p-4">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                <div className="flex-1">
                  <p className="font-medium">Node.js Backend</p>
                  <p className="text-sm text-slate-400">In Progress</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-slate-900 p-4">
                <Clock3 className="h-5 w-5 text-slate-400" />
                <div className="flex-1">
                  <p className="font-medium">Database Design</p>
                  <p className="text-sm text-slate-400">Upcoming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}