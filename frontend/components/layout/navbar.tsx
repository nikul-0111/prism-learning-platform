"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide Navbar on dashboard pages
  const isDashboardPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/instructor") ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/admin");

  if (isDashboardPage) {
    return null;
  }

  // Support both AuthContext user and NextAuth session user after client mount
  const currentUser = mounted
    ? user ||
      (session?.user
        ? {
            name: session.user.name || "User",
            role: session.user.role || "STUDENT",
          }
        : null)
    : null;

  const isInstructor = currentUser?.role?.toUpperCase() === "INSTRUCTOR";
  const dashboardHref = isInstructor ? "/instructor/dashboard" : "/dashboard";

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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/30">
              P
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              PRISM
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            About
          </Link>

          <Link
            href="/courses"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Courses
          </Link>

          <Link
            href="/how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            How It Works
          </Link>

          <Link
            href="/faq"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            FAQ
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Contact
          </Link>
        </nav>

        {/* Auth status buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <span>{currentUser.name}</span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 border border-indigo-200">
                  {currentUser.role}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 hover:scale-105"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}