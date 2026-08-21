"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, BookOpen, ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/auth-context";

interface AdminWelcomeBannerProps {
  pendingCount?: number;
}

export default function AdminWelcomeBanner({ pendingCount = 0 }: AdminWelcomeBannerProps) {
  const { user: authUser } = useAuth();
  const { data: session } = useSession();
  const [name, setName] = useState<string>("Admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("prism_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) {
          setName(parsed.name);
          return;
        }
      } catch {
        // fallback
      }
    }

    if (authUser?.name) {
      setName(authUser.name);
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [authUser, session]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 p-7 text-white shadow-xl shadow-indigo-500/15 sm:p-10">
      {/* Ambient background light patterns */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(#rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left Column: Welcome Tag & Headline */}
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>Admin Studio</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Welcome back, <span className="underline decoration-amber-300/60 decoration-wavy underline-offset-8">{name}</span> 👋
          </h1>

          <p className="mt-3.5 text-sm leading-relaxed text-blue-100 sm:text-base">
            Review submitted courses, monitor platform storage and bandwidth metrics, and inspect instructor payout calculations from your dashboard.
          </p>
        </div>

        {/* Right Column: Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 shrink-0">
          <Link
            href="/admin/courses/pending"
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-xl shadow-indigo-900/20 transition-all duration-200 hover:bg-indigo-50 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-4 w-4 text-indigo-600 transition-transform group-hover:rotate-90" />
            <span>Review Pending ({pendingCount})</span>
            <ArrowUpRight className="h-4 w-4 text-indigo-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md border border-white/25 transition-all duration-200 hover:bg-white/25 hover:border-white/40 active:scale-95"
          >
            <BookOpen className="h-4 w-4 text-blue-200" />
            <span>All Courses</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
