import InstructorWelcome from "@/components/instructor/dashboard/instructor-welcome";
import InstructorStats from "@/components/instructor/dashboard/instructor-stats";
import RecentCourses from "@/components/instructor/dashboard/recent-courses";

export default function InstructorDashboardPage() {
  return (
    <div className="space-y-8">
      <InstructorWelcome />

      <InstructorStats />

      <RecentCourses />
    </div>
  );
}