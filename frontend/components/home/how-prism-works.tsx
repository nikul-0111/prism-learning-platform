import Link from "next/link";
import {
  UserPlus,
  Search,
  BookOpen,
  PlayCircle,
  ClipboardCheck,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up for PRISM and create your student profile to start your personalized learning journey.",
  },
  {
    number: "02",
    icon: Search,
    title: "Discover a Course",
    description:
      "Explore courses by category, skill level, and learning goals to find the right course for you.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Start Learning",
    description:
      "Follow structured lessons, watch learning content, study resources, and learn at your own pace.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Practice & Assess",
    description:
      "Complete quizzes and assessments to test your understanding and measure your knowledge.",
  },
  {
    number: "05",
    icon: PlayCircle,
    title: "Track Your Progress",
    description:
      "Monitor your completed lessons, course progress, assessment results, and learning achievements.",
  },
  {
    number: "06",
    icon: Award,
    title: "Earn Your Certificate",
    description:
      "Complete the required course activities and earn a certificate that recognizes your achievement.",
  },
];

export default function HowPrismWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Background */}
      <div className="absolute left-1/2 top-0 -z-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            How PRISM Works
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Your Learning Journey,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            PRISM makes learning simple. Create an account, choose your course,
            learn, practice, track your progress, and earn certificates.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gray-200 lg:block" />

          <div className="space-y-10 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className="relative lg:grid lg:grid-cols-2 lg:gap-16"
                >
                  {/* Left / Right Content */}
                  <div
                    className={`${
                      isEven
                        ? "lg:col-start-1 lg:text-right"
                        : "lg:col-start-2 lg:text-left"
                    }`}
                  >
                    <div
                      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7 ${
                        isEven ? "lg:mr-8" : "lg:ml-8"
                      }`}
                    >
                      <div
                        className={`flex items-start gap-5 ${
                          isEven ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon className="h-7 w-7" />
                        </div>

                        {/* Content */}
                        <div>
                          <div
                            className={`text-sm font-bold text-blue-600 ${
                              isEven ? "lg:text-right" : ""
                            }`}
                          >
                            STEP {step.number}
                          </div>

                          <h3 className="mt-1 text-xl font-bold text-gray-900">
                            {step.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Number */}
                  <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-sm font-bold text-white shadow-lg">
                      {step.number}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simple Journey Card */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Your PRISM Journey
              </p>

              <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                From your first lesson to your certificate.
              </h3>

              <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                Every step is designed to keep you focused, motivated, and
                moving toward your learning goals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                "Learn",
                "Practice",
                "Assess",
                "Track",
                "Achieve",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800"
          >
            Start Learning
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}