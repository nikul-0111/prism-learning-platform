"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: "indigo" | "amber" | "emerald" | "rose" | "sky" | "purple";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = "All Time",
  variant = "indigo",
}: MetricCardProps) {
  const styles = {
    indigo: {
      gradient: "from-indigo-500 to-blue-600",
      accentBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    emerald: {
      gradient: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    amber: {
      gradient: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    rose: {
      gradient: "from-rose-500 to-red-600",
      accentBg: "bg-rose-50 text-rose-600 border-rose-100",
    },
    sky: {
      gradient: "from-sky-500 to-cyan-600",
      accentBg: "bg-sky-50 text-sky-600 border-sky-100",
    },
    purple: {
      gradient: "from-purple-500 to-pink-600",
      accentBg: "bg-purple-50 text-purple-600 border-purple-100",
    },
  };

  const currentStyle = styles[variant] || styles.indigo;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Top accent line */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${currentStyle.gradient}`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110 ${currentStyle.accentBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="font-medium text-slate-500">
          {subtitle || "Platform metric"}
        </span>

        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
          <TrendingUp className="h-3 w-3 text-indigo-600" />
          {trend}
        </span>
      </div>
    </div>
  );
}
