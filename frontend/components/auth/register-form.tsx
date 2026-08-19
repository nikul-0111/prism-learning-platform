"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/auth-context";
import PasswordInput from "./password-input";
import type { UserRole } from "@/types/auth.types";

const roles: UserRole[] = [
  "STUDENT",
  "INSTRUCTOR",
  "ADMIN",
];

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser } = useAuth();

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const emailParam = searchParams.get("email");

    if (errorParam === "AccountNotFound") {
      if (emailParam) {
        setEmail(emailParam);
      }
      setError(
        "No registered account was found with this Google email. Please complete your registration below to get started.",
      );
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!mobileNumber.trim()) {
      setError("Mobile number is required.");
      return;
    }

    const cleanMobile = mobileNumber.replace(/^(\+91|0)/, "").replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const registeredUser = await registerUser({
        name: name.trim(),
        mobileNumber: cleanMobile,
        email: email.trim(),
        password,
        confirmPassword,
        role,
      });

      // Sign in with Auth.js session
      await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      setSuccess("Account created successfully! Redirecting...");

      const userRole = registeredUser?.role?.toLowerCase();

      setTimeout(() => {
        if (userRole === "instructor") {
          router.push("/instructor/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Mobile Number */}
      <div>
        <label
          htmlFor="mobileNumber"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Mobile number
        </label>

        <input
          id="mobileNumber"
          name="mobileNumber"
          type="tel"
          autoComplete="tel"
          placeholder="Enter your 10-digit mobile number"
          value={mobileNumber}
          onChange={(event) => setMobileNumber(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Password */}
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={password}
        placeholder="Create a password (min 8 chars)"
        autoComplete="new-password"
        onChange={setPassword}
      />

      {/* Confirm Password */}
      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        value={confirmPassword}
        placeholder="Confirm your password"
        autoComplete="new-password"
        onChange={setConfirmPassword}
      />

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Role
        </label>

        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => {
            const selectedRole = event.target.value;

            if (
              selectedRole === "STUDENT" ||
              selectedRole === "INSTRUCTOR" ||
              selectedRole === "ADMIN"
            ) {
              setRole(selectedRole);
            }
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          {roles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
        >
          {success}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      {/* Login Link */}
      <div className="border-t border-slate-800 pt-5 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}