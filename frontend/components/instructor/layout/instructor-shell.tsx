"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/auth-context";
import InstructorSidebar from "./instructor-sidebar";
import InstructorHeader from "./instructor-header";
import InstructorMobileNav from "./instructor-mobile-nav";

interface InstructorShellProps {
  children: ReactNode;
}

export default function InstructorShell({
  children,
}: InstructorShellProps) {
  const { user, token, loading: authLoading } = useAuth();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const isSessionLoading = sessionStatus === "loading";
  const isLoading = authLoading || isSessionLoading;

  const isAuthenticated =
    (!!token && !!user) || (sessionStatus === "authenticated" && !!session?.user);

  useEffect(() => {
    // If authenticated via NextAuth session, sync token & user to localStorage
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
      <InstructorSidebar />

      {/* Main Area */}
      <div className="lg:pl-72">
        {/* Desktop Header */}
        <InstructorHeader />

        {/* Mobile Header */}
        <InstructorMobileNav />

        {/* Page Content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}