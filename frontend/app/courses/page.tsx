import CoursesHero from "@/components/courses/courses-hero";
import CourseGrid from "@/components/courses/course-grid";
import CoursesCta from "@/components/courses/courses-cta";

export default function CoursesPage() {
  return (
    <main>
      <CoursesHero />
      <CourseGrid />
      <CoursesCta />
    </main>
  );
}
