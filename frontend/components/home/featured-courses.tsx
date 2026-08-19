import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Users,
  Star,
} from "lucide-react";

const courses = [
  {
    title: "Full Stack Web Development",
    description:
      "Learn frontend and backend development by building modern, real-world web applications.",
    category: "Web Development",
    level: "Intermediate",
    lessons: 42,
    students: "1.2K",
    rating: "4.9",
    progress: 78,
    icon: "💻",
  },
  {
    title: "JavaScript Fundamentals",
    description:
      "Build a strong foundation in JavaScript concepts, programming logic, ES6+, and modern development.",
    category: "Programming",
    level: "Beginner",
    lessons: 28,
    students: "2.4K",
    rating: "4.8",
    progress: 64,
    icon: "JS",
  },
  {
    title: "React Development",
    description:
      "Master React components, hooks, state management, routing, and modern application development.",
    category: "Frontend",
    level: "Intermediate",
    lessons: 35,
    students: "1.8K",
    rating: "4.9",
    progress: 52,
    icon: "⚛️",
  },
  {
    title: "Database & PostgreSQL",
    description:
      "Understand relational databases, SQL queries, PostgreSQL, database design, and data management.",
    category: "Backend",
    level: "Intermediate",
    lessons: 24,
    students: "980",
    rating: "4.7",
    progress: 40,
    icon: "🗄️",
  },
  {
    title: "UI/UX Design Fundamentals",
    description:
      "Learn user interface principles, user experience, wireframing, design systems, and usability.",
    category: "Design",
    level: "Beginner",
    lessons: 22,
    students: "1.1K",
    rating: "4.8",
    progress: 35,
    icon: "🎨",
  },
  {
    title: "Node.js & Express",
    description:
      "Build scalable backend APIs using Node.js, Express, authentication, databases, and REST APIs.",
    category: "Backend",
    level: "Advanced",
    lessons: 31,
    students: "1.5K",
    rating: "4.9",
    progress: 28,
    icon: "🚀",
  },
];

export default function FeaturedCourses() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Featured Courses
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Learn Skills That
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Move You Forward
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Explore our most popular courses and start building practical
              skills with structured, instructor-led learning.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex w-fit items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View All Courses
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Course Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Course Image / Icon */}
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-4xl shadow-lg">
                  {course.icon}
                </div>

                {/* Category */}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                  {course.category}
                </span>

                {/* Level */}
                <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                  {course.level}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {course.rating}
                  </span>
                  <span className="text-gray-400">rating</span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {course.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="mt-5 flex flex-wrap gap-4 border-b border-gray-100 pb-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons} Lessons
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {course.students} Students
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-500">
                      Course Progress
                    </span>

                    <span className="font-semibold text-blue-600">
                      {course.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500 group-hover:bg-purple-600"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock3 className="h-4 w-4" />
                    Self-paced
                  </div>

                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    View Course
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Explore All Courses
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}