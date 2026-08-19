import { Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <AuthCard
          title="Welcome back"
          description="Login to your PRISM learning account"
        >
          <Suspense fallback={<div className="py-6 text-center text-slate-400">Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </AuthCard>
      </div>
    </main>
  );
}