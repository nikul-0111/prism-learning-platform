"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckCircle2,
  BookOpen,
  Users,
  HardDrive,
  Activity,
  CircleDollarSign,
  GraduationCap,
} from "lucide-react";
import { getPendingCourses } from "@/lib/api/admin";
import { useAuth } from "@/context/auth-context";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    getPendingCourses()
      .then((courses) => setPendingCount(courses.length))
      .catch(() => setPendingCount(0));
  }, [pathname]);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Course Approvals",
      href: "/admin/courses/pending",
      icon: CheckCircle2,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      name: "All Courses",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Users & Instructors",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Storage & Cleanup",
      href: "/admin/storage",
      icon: HardDrive,
    },
    {
      name: "Bandwidth & Usage",
      href: "/admin/usage",
      icon: Activity,
    },
    {
      name: "Payout Reports",
      href: "/admin/payouts",
      icon: CircleDollarSign,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
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
          WORKSPACE
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            mounted &&
            (pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                item.href !== "/admin/courses" &&
                pathname.startsWith(item.href)));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
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

              {item.badge !== null && item.badge !== undefined && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                  {item.badge}
                </span>
              )}

              {isActive && item.badge === null && (
                <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
            {user?.name ? user.name[0]?.toUpperCase() : "A"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "Administrator"}
            </p>

            <p className="truncate text-xs text-slate-500">
              Admin Governance
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
