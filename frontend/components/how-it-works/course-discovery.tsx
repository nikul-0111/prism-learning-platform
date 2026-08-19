import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Filter,
  Search,
  Star,
} from "lucide-react";

const categories = [
  "Web Development",
  "Programming",
  "Data Science",
  "Design",
];

export default function CourseDiscovery() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="inline-flex rounded-xl bg-indigo-50 p-3">
              <Search className="h-6 w-6 text-indigo-600" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Step 01
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Discover the right course for you
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Explore courses by category, difficulty level, ratings, and
              learning goals. PRISM helps you find content that fits your
              interests.
            </p>

            <Link
              href="/courses"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Browse courses
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 shadow-xl sm:p-8">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <Search className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-400">
                  Search for a course...
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 p-4">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                    <BookOpen className="h-7 w-7 text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Full Stack Web Development
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Beginner to Advanced
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}