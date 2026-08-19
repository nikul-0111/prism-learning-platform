import CourseCard from "./course-card";
import { courses } from "@/data/courses";

export default function CourseGrid() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Available Courses
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Explore our courses
            </h2>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {courses.length} courses
          </p>
        </div>

        {/* Course Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              {...course}
            />
          ))}
        </div>

      </div>
    </section>
  );
}