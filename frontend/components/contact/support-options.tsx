import {
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  MonitorCog,
  UserRound,
} from "lucide-react";

const supportOptions = [
  {
    icon: HelpCircle,
    title: "General Support",
    description:
      "Questions about using PRISM or finding the right place to get started.",
  },
  {
    icon: UserRound,
    title: "Account Assistance",
    description:
      "Need help with registration, login, password recovery, or account settings?",
  },
  {
    icon: BookOpen,
    title: "Course Assistance",
    description:
      "Get help with course access, enrollment, or other course-related questions.",
  },
  {
    icon: MonitorCog,
    title: "Technical Support",
    description:
      "Report problems with the platform, pages, videos, or other technical issues.",
  },
];

export default function SupportOptions() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
            Support Center
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Choose the right support
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Select the area that best matches your question and get the help
            you need from the PRISM support team.
          </p>
        </div>

        {/* Support Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supportOptions.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
              >
                {/* Top gradient line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 ring-1 ring-indigo-100 transition-all duration-300 group-hover:scale-110 group-hover:from-indigo-100 group-hover:to-blue-100">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>

                {/* Content */}
                <div className="mt-6 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-indigo-600">
                    {option.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {option.description}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  <span>Get help</span>

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}