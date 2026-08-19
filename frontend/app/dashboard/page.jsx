"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.accessToken) {
        localStorage.setItem("prism_token", session.accessToken);
      }
      localStorage.setItem("prism_user", JSON.stringify(session.user));

      const userRole = session.user.role?.toUpperCase();
      if (userRole === "INSTRUCTOR") {
        router.replace("/instructor/dashboard");
      } else {
        router.replace("/student/my-courses");
      }
    } else {
      router.replace("/student/my-courses");
    }
  }, [session, status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}