import React from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}