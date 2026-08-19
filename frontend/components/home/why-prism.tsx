import {
  Target,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

const reasons = [
  {
    icon: Target,
    title: "Learn With Purpose",
    description:
      "Follow clear learning paths designed to help you build practical knowledge and achieve your learning goals.",
  },
  {
    icon: Lightbulb,
    title: "Practical Learning",
    description:
      "Go beyond theory with practical lessons, examples, activities, and assessments that strengthen your skills.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Growth",
    description:
      "See your learning progress, completed courses, assessment results, and achievements in one place.",
  },
  {
    icon: Users,
    title: "Student-Centered",
    description:
      "PRISM is designed around students so you can learn at your own pace and manage your learning journey.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Platform",
    description:
      "Your courses, progress, assessments, and certificates are organized within a secure and structured platform.",
  },
  {
    icon: Sparkles,
    title: "Better Learning Experience",
    description:
      "A clean and modern interface makes it easier to discover courses, learn, practice, and achieve your goals.",
  },
];

export default function WhyPrism() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-purple-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
            <Sparkles className="h-4 w-4" />
            Why PRISM?
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Built to Make Learning
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple, Practical & Effective
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            PRISM combines structured courses, practical learning, progress
            tracking, assessments, and achievements to give students a complete
            learning experience.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          {/* Left Visual */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              {/* Main Card */}
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-xl sm:p-8">
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Your Learning Journey
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-gray-900">
                      Keep Growing 🚀
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                    🎓
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Learning Progress
                      </p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">
                        78%
                      </p>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-blue-500 text-sm font-bold text-blue-600">
                      78%
                    </div>
                  </div>

                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-[78%] rounded-full bg-blue-600" />
                  </div>
                </div>

                {/* Learning Steps */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Course Completed
                      </p>
                      <p className="text-xs text-gray-500">
                        JavaScript Fundamentals
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      →
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Currently Learning
                      </p>
                      <p className="text-xs text-gray-500">
                        Advanced React Development
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      ★
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Next Achievement
                      </p>
                      <p className="text-xs text-gray-500">
                        Complete 5 more lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -right-5 -top-5 hidden rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-xl sm:block">
                <p className="text-xs text-gray-500">Certificates Earned</p>
                <p className="mt-1 text-2xl font-bold text-purple-600">04</p>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-xl sm:block">
                <p className="text-xs text-gray-500">Learning Streak</p>
                <p className="mt-1 text-2xl font-bold text-orange-500">
                  12 Days 🔥
                </p>
              </div>
            </div>
          </div>

          {/* Right Reasons */}
          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <div
                  key={reason.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {reason.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-10 text-center text-white sm:px-10">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Ready to Start Your Learning Journey?
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Explore PRISM, discover courses that match your goals, and start
            building skills that matter.
          </p>
        </div>
      </div>
    </section>
  );
}