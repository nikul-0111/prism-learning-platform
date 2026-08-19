"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on dashboard pages
  const isDashboardPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/instructor") ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/admin");

  if (isDashboardPage) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/30">
                P
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">PRISM</h2>
                <p className="text-sm text-slate-500">Learning Platform</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Learn modern skills through interactive courses, video lessons,
              quizzes, and certificates.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Platform</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
              <Link href="/about" className="transition hover:text-indigo-600">
                About
              </Link>

              <Link href="/courses" className="transition hover:text-indigo-600">
                Courses
              </Link>

              <Link href="/how-it-works" className="transition hover:text-indigo-600">
                How It Works
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Support</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
              <Link href="/faq" className="transition hover:text-indigo-600">
                FAQ
              </Link>

              <Link href="/contact" className="transition hover:text-indigo-600">
                Contact
              </Link>

              <Link href="/login" className="transition hover:text-indigo-600">
                Login
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Contact</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>📧 support@prism.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Gandhinagar, Gujarat, India</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © 2026 PRISM Learning Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}