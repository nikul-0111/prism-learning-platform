import { ReactNode } from "react";
import StudentShell from "@/components/student/layout/student-shell";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <StudentShell>{children}</StudentShell>;
}
