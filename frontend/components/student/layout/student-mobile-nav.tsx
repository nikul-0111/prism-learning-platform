"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, User } from "lucide-react";

const mobileLinks = [
  { name: "All Courses", href: "/student/all-courses", icon: BookOpen },
  { name: "My Courses", href: "/student/my-courses", icon: GraduationCap },
  { name: "Profile", href: "/student/profile", icon: User },
];

export default function StudentMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/90 px-4 py-2 backdrop-blur-md lg:hidden">
      {mobileLinks.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
              isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
