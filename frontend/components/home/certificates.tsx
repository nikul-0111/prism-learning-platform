import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Download,
  ShieldCheck,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const certificateFeatures = [
  {
    icon: Award,
    title: "Recognize Your Achievement",
    description:
      "Receive a certificate when you successfully complete the required course learning and assessments.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Certificates",
    description:
      "Certificates can include unique details that make your learning achievement easy to identify and verify.",
  },
  {
    icon: Download,
    title: "Easy to Access",
    description:
      "Keep your certificates available from your PRISM profile so you can access them whenever you need them.",
  },
  {
    icon: Share2,
    title: "Share Your Achievement",
    description:
      "Showcase completed courses and learning achievements as part of your professional learning journey.",
  },
];

export default function Certificates() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="absolute left-1/2 top-0 -z-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-purple-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            <Award className="h-4 w-4" />
            Certificates & Achievements
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Turn Your Learning Into
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Recognized Achievement
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Complete your courses, demonstrate your knowledge, and earn
            certificates that represent the skills and learning you have
            achieved through PRISM.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          {/* Certificate Preview */}
          <div className="relative">
            <div className="relative mx-auto max-w-xl">
              {/* Certificate */}
              <div className="rounded-2xl border-4 border-blue-100 bg-white p-2 shadow-2xl">
                <div className="border border-gray-200 p-6 sm:p-10">
                  {/* Certificate Header */}
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Award className="h-7 w-7" />
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                      PRISM Learning Platform
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                      Certificate of Completion
                    </h3>

                    <p className="mt-5 text-sm text-gray-500">
                      This certificate is proudly presented to
                    </p>

                    <p className="mt-3 text-2xl font-bold text-gray-900">
                      Alex Student
                    </p>

                    <div className="mx-auto mt-3 h-px w-48 bg-gray-200" />
                  </div>

                  {/* Course */}
                  <div className="mt-7 text-center">
                    <p className="text-sm text-gray-500">
                      for successfully completing
                    </p>

                    <h4 className="mt-2 text-xl font-bold text-blue-600">
                      Full Stack Web Development
                    </h4>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                      Demonstrating successful completion of the required
                      learning modules, lessons, and assessments.
                    </p>
                  </div>

                  {/* Certificate Details */}
                  <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Issued
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">
                        Aug 2026
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Certificate ID
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">
                        PR-2026-001
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Status
                      </p>
                      <p className="mt-1 text-xs font-semibold text-green-600">
                        Verified
                      </p>
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <div className="h-px w-28 bg-gray-300" />
                      <p className="mt-2 text-[10px] text-gray-500">
                        PRISM Instructor
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-blue-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -right-5 -top-5 hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500">
                      Certificate Status
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      Verified
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Badge */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    🏆
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500">
                      Achievement
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      Course Completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-5 sm:grid-cols-2">
            {certificateFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Journey */}
        <div className="mt-16 rounded-3xl bg-gray-50 p-8 sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Sparkles className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              From Learning to Achievement
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Follow a simple journey from completing your course to receiving
              your certificate.
            </p>
          </div>

          {/* Journey Steps */}
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Learn",
                description: "Complete your course lessons.",
              },
              {
                number: "02",
                title: "Practice",
                description: "Apply what you have learned.",
              },
              {
                number: "03",
                title: "Assess",
                description: "Complete required assessments.",
              },
              {
                number: "04",
                title: "Achieve",
                description: "Earn your PRISM certificate.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {step.number}
                </div>

                <h4 className="mt-4 font-bold text-gray-900">
                  {step.title}
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Start Learning
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}