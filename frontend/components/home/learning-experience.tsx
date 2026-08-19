import {
  LayoutDashboard,
  Smartphone,
  BarChart3,
  BookOpenCheck,
  MessageCircle,
  Zap,
  CheckCircle2,
} from "lucide-react";

const experiences = [
  {
    icon: LayoutDashboard,
    title: "Personalized Dashboard",
    description:
      "Get a clear overview of your courses, learning progress, upcoming assessments, achievements, and recent activity.",
  },
  {
    icon: BookOpenCheck,
    title: "Structured Learning",
    description:
      "Learn through organized modules and lessons so you always know what to study next and how far you have progressed.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track course completion, lesson progress, assessment performance, and your overall learning journey.",
  },
  {
    icon: MessageCircle,
    title: "Interactive Experience",
    description:
      "Stay connected with your learning environment through engaging content, activities, feedback, and course resources.",
  },
  {
    icon: Smartphone,
    title: "Learn Anywhere",
    description:
      "Access your learning dashboard and course content across different devices with a responsive experience.",
  },
  {
    icon: Zap,
    title: "Focused Learning",
    description:
      "A clean and distraction-free interface helps you focus on learning instead of navigating complicated systems.",
  },
];

export default function LearningExperience() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            Learning Experience
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Designed Around
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Learning Experience
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            PRISM gives students a modern, organized, and easy-to-use
            environment where every part of their learning journey is connected.
          </p>
        </div>

        {/* Main Experience Preview */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          {/* Dashboard Preview */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-5 py-4">
                <div className="h-3 w-3 rounded-full bg-gray-300" />
                <div className="h-3 w-3 rounded-full bg-gray-300" />
                <div className="h-3 w-3 rounded-full bg-gray-300" />

                <div className="ml-4 h-7 flex-1 rounded-md bg-white" />
              </div>

              {/* Dashboard */}
              <div className="flex min-h-[430px]">
                {/* Sidebar */}
                <div className="hidden w-40 border-r border-gray-100 bg-gray-50 p-4 sm:block">
                  <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                      P
                    </div>
                    <span className="font-bold text-gray-900">PRISM</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Dashboard",
                      "My Courses",
                      "Assessments",
                      "Certificates",
                      "Profile",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-2 text-xs font-medium ${
                          index === 0
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-500"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Dashboard */}
                <div className="flex-1 p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Good morning</p>
                      <h3 className="mt-1 text-xl font-bold text-gray-900">
                        Welcome back, Student 👋
                      </h3>
                    </div>

                    <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 sm:flex">
                      S
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["06", "Courses"],
                      ["42", "Lessons"],
                      ["08", "Completed"],
                      ["03", "Certificates"],
                    ].map(([number, label]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                      >
                        <p className="text-lg font-bold text-gray-900">
                          {number}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-500">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Current Course */}
                  <div className="mt-5 rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">
                          Continue Learning
                        </p>
                        <h4 className="mt-1 text-sm font-bold text-gray-900">
                          Full Stack Web Development
                        </h4>
                      </div>

                      <span className="text-xs font-semibold text-blue-600">
                        72%
                      </span>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-gray-100">
                      <div className="h-full w-[72%] rounded-full bg-blue-600" />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500">
                      <span>18 of 25 lessons</span>
                      <span>7 lessons remaining</span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold text-gray-900">
                      Recent Activity
                    </p>

                    <div className="mt-3 space-y-2">
                      {[
                        "Completed React Components lesson",
                        "Passed JavaScript assessment",
                        "Earned a new achievement",
                      ].map((activity) => (
                        <div
                          key={activity}
                          className="flex items-center gap-2 text-[11px] text-gray-500"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Achievement */}
            <div className="absolute -bottom-6 -right-5 hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  🏆
                </div>

                <div>
                  <p className="text-[10px] text-gray-500">
                    New Achievement
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Learning Streak
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Features */}
          <div className="grid gap-5 sm:grid-cols-2">
            {experiences.map((experience) => {
              const Icon = experience.icon;

              return (
                <div
                  key={experience.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {experience.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {experience.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Benefits */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Simple to Use
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Everything is organized so you can focus on learning.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Always Know Your Progress
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Clearly understand where you are and what comes next.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Zap className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Learn Efficiently
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Spend less time navigating and more time learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}