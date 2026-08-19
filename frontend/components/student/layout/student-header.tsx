"use client";

import { useAuth } from "@/context/auth-context";
import { User, LogOut, ChevronDown, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StudentHeader() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 sm:px-8 backdrop-blur-xl shadow-sm transition-all">
      {/* Left side empty placeholder / brand spacing */}
      <div className="flex items-center gap-4" />

      {/* Right Header Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Student Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-1.5 pr-3 shadow-sm transition hover:border-indigo-300 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-black text-white shadow-md shadow-indigo-600/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-extrabold text-slate-900 leading-tight">
                {user?.name || "Student User"}
              </p>
              <p className="text-[10px] font-bold text-indigo-600 tracking-wide uppercase">
                {user?.role || "STUDENT"}
              </p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="text-xs font-extrabold text-slate-900">{user?.name}</p>
                <p className="text-[10px] font-medium text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/student/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                <Link
                  href="/student/my-courses"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  <BookOpen className="h-4 w-4" />
                  My Enrolled Courses
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
