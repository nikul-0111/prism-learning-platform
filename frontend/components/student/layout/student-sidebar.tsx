"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const studentNavigation = [
  {
    name: "All Courses",
    href: "/student/all-courses",
    icon: BookOpen,
  },
  {
    name: "My Courses",
    href: "/student/my-courses",
    icon: GraduationCap,
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex shadow-sm">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100">
        <Link href="/student/all-courses" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              PRISM
            </h1>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {studentNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer User Info & Logout */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="truncate">
              <p className="truncate text-xs font-extrabold text-slate-900">
                {user?.name || "Student User"}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500">
                {user?.email || "student@prism.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
