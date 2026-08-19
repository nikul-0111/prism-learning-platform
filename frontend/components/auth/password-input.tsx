"use client";

import { useState } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  onChange,
  required = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}