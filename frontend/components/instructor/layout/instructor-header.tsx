"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useAuth } from "@/context/auth-context";

interface User {
  name?: string;
  email?: string;
  role?: string;
}

export default function InstructorHeader() {
  const { logout } = useAuth();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("prism_user");

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }
  }, []);

  async function handleLogout() {
    logout();
    localStorage.removeItem("prism_token");
    localStorage.removeItem("prism_user");

    try {
      await nextAuthSignOut({ redirect: false });
    } catch {
      // ignore
    }

    // Hard navigation to home page to flush browser memory
    window.location.href = "/";
  }

  // Get instructor name from session or localStorage
  const instructorName =
    user?.name || session?.user?.name || "Instructor";
  const instructorEmail = user?.email || session?.user?.email;

  // Get first letter for avatar
  const avatarLetter = instructorName.charAt(0).toUpperCase();

  return (
    <header className="hidden h-20 border-b border-slate-200 bg-white lg:flex lg:items-center lg:justify-between lg:px-8">
      {/* Brand Header Spacing */}
      <div className="flex items-center gap-4" />

      {/* Right Side Profile */}
      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
              {avatarLetter}
            </div>

            {/* User Information */}
            <div className="hidden text-left xl:block">
              {/* Instructor Name */}
              <p className="text-sm font-semibold text-slate-900">
                {instructorName}
              </p>

              {/* Role */}
              <p className="text-xs text-slate-500">
                Instructor
              </p>
            </div>

            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {/* Profile */}
              <div className="border-b border-slate-100 px-4 py-3">
                {/* Name */}
                <p className="text-sm font-semibold text-slate-900">
                  {instructorName}
                </p>

                {/* Role */}
                <p className="mt-1 text-xs text-slate-500">
                  Instructor
                </p>

                {/* Email */}
                {instructorEmail && (
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {instructorEmail}
                  </p>
                )}
              </div>

              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/instructor/settings";
                }}
                className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Settings
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />

                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}