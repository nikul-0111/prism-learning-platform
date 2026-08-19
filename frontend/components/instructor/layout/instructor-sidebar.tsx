"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/instructor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    name: "Students",
    href: "/instructor/students",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/instructor/analytics",
    icon: BarChart3,
  },
  {
    name: "Payouts",
    href: "/instructor/payouts",
    icon: CircleDollarSign,
  },
  {
    name: "Settings",
    href: "/instructor/settings",
    icon: Settings,
  },
];

export default function InstructorSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <Link href="/instructor/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              PRISM
            </h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            mounted &&
            (pathname === item.href ||
              (item.href !== "/instructor/dashboard" &&
                pathname.startsWith(item.href)));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />

              <span>{item.name}</span>

              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
            I
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              Instructor
            </p>

            <p className="truncate text-xs text-slate-500">
              Instructor Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}