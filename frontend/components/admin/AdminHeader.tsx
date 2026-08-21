"use client";

import { useState, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useAuth } from "@/context/auth-context";

interface User {
  name?: string;
  email?: string;
  role?: string;
}

export default function AdminHeader() {
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

    window.location.href = "/login";
  }

  const adminName = user?.name || session?.user?.name || "Admin User";
  const adminEmail = user?.email || session?.user?.email || "admin@prism.com";
  const avatarLetter = adminName.charAt(0).toUpperCase();

  return (
    <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4" />

      {/* Right Side Profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-slate-50 border border-transparent hover:border-slate-200"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-xs">
              {avatarLetter}
            </div>

            {/* User Information */}
            <div className="hidden text-left xl:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {adminName}
              </p>
              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {/* Profile details */}
              <div className="border-b border-slate-100 px-4 py-3.5">
                <p className="text-sm font-bold text-slate-900">
                  {adminName}
                </p>

                <p className="mt-0.5 text-xs font-semibold text-blue-600">
                  Administrator Account
                </p>

                {adminEmail && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {adminEmail}
                  </p>
                )}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
