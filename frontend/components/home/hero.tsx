"use client";

import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-purple-100/40 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
        {/* Centered Hero Content */}
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-700">
            <Sparkles className="h-5 w-5" />
            Smart Learning Platform
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl xl:text-8xl">
            Learn Smarter.
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Grow Faster.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-4xl text-xl leading-9 text-gray-600 sm:text-2xl sm:leading-10">
            PRISM is a modern learning platform that helps students learn new
            skills, follow structured courses, track their progress, and
            complete interactive assessments.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Explore Courses
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <PlayCircle className="h-5 w-5" />
              How PRISM Works
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-base text-gray-600 sm:flex-row sm:flex-wrap sm:gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Structured Learning
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Progress Tracking
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Interactive Assessments
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}