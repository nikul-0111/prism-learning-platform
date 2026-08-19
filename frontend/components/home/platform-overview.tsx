import {
  BookOpen,
  BarChart3,
  Award,
  Users,
  Video,
  ClipboardCheck,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Structured Courses",
    description:
      "Learn through carefully organized courses with lessons, modules, resources, and practical learning paths.",
  },
  {
    icon: Video,
    title: "Interactive Learning",
    description:
      "Access engaging lessons and learning materials designed to make complex topics easier to understand.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Monitor completed lessons, course progress, achievements, and your overall learning journey.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessments",
    description:
      "Test your knowledge with quizzes and assessments and identify areas where you can improve.",
  },
  {
    icon: Award,
    title: "Earn Certificates",
    description:
      "Complete courses and assessments to earn certificates that showcase your learning achievements.",
  },
  {
    icon: Users,
    title: "Learn With PRISM",
    description:
      "Connect your learning experience across students, instructors, and administrators in one platform.",
  },
];

export default function PlatformOverview() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24">
      {/* Background decoration */}
      <div className="absolute left-0 top-20 -z-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-0 h-72 w-72 rounded-full bg-purple-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Platform Overview
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learn and Grow
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            PRISM brings courses, learning resources, assessments, progress
            tracking, and certificates together in one simple learning
            platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>

                {/* Bottom indicator */}
                <div className="mt-6 h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-20" />
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">100+</p>
              <p className="mt-2 text-sm text-gray-500">Learning Resources</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">50+</p>
              <p className="mt-2 text-sm text-gray-500">Courses</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">1K+</p>
              <p className="mt-2 text-sm text-gray-500">Students</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">95%</p>
              <p className="mt-2 text-sm text-gray-500">Learning Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}