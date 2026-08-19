import { Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <AuthCard
          title="Create your account"
          description="Join the PRISM learning platform"
        >
          <Suspense fallback={<div className="py-6 text-center text-slate-400">Loading form...</div>}>
            <RegisterForm />
          </Suspense>
        </AuthCard>
      </div>
    </main>
  );
}