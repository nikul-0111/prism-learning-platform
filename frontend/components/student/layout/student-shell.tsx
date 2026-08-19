"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/auth-context";
import StudentSidebar from "./student-sidebar";
import StudentHeader from "./student-header";
import StudentMobileNav from "./student-mobile-nav";

interface StudentShellProps {
  children: ReactNode;
}

export default function StudentShell({ children }: StudentShellProps) {
  const { user, token, loading: authLoading } = useAuth();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const isSessionLoading = sessionStatus === "loading";
  const isLoading = authLoading || isSessionLoading;

  const isAuthenticated =
    (!!token && !!user) || (sessionStatus === "authenticated" && !!session?.user);

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user) {
      if (session.accessToken) {
        localStorage.setItem("prism_token", session.accessToken);
      }
      localStorage.setItem("prism_user", JSON.stringify(session.user));
    }
  }, [session, sessionStatus]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <StudentSidebar />

      {/* Main Area */}
      <div className="lg:pl-72 pb-16 lg:pb-0">
        {/* Desktop Header */}
        <StudentHeader />

        {/* Page Content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Mobile Bottom Nav */}
        <StudentMobileNav />
      </div>
    </div>
  );
}
