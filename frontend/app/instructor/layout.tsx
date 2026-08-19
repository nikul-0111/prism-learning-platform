import { ReactNode } from "react";
import InstructorShell from "@/components/instructor/layout/instructor-shell";

interface InstructorLayoutProps {
  children: ReactNode;
}

export default function InstructorLayout({
  children,
}: InstructorLayoutProps) {
  return <InstructorShell>{children}</InstructorShell>;
}