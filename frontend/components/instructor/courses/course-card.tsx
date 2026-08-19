import Link from "next/link";
import CourseStatus from "./course-status";
import CourseActions from "./course-actions";

interface CourseCardProps {
  course: any;
  onDeleted?: (courseId: string) => void;
}

export default function CourseCard({ course, onDeleted }: CourseCardProps) {
  // Format level display
  const rawLevel = (course.level || "BEGINNER").toUpperCase();
  const levelBadge =
    rawLevel === "ADVANCED"
      ? { label: "Advanced", icon: "🚀", style: "bg-purple-500/20 text-purple-100 border-purple-400/30" }
      : rawLevel === "INTERMEDIATE"
      ? { label: "Intermediate", icon: "⚡", style: "bg-amber-500/20 text-amber-100 border-amber-400/30" }
      : { label: "Beginner", icon: "🌱", style: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30" };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10">
      
      {/* Top Ambient Glow & Thumbnail Header */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5">
        {course.thumbnail ? (
          <>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/30" />
          </>
        ) : (
          <>
            {/* Decorative Background Glow Circles */}
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="absolute inset-0 bg-[radial-gradient(#rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          </>
        )}

        <div className="relative flex h-full flex-col justify-between z-10">
          
          {/* Top Row: Category & Status */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {course.category || "General"}
            </span>

            <CourseStatus status={course.status || "DRAFT"} />
          </div>

          {/* Bottom Row: Level Tag */}
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-md border ${levelBadge.style}`}>
              <span>{levelBadge.icon}</span>
              {levelBadge.label}
            </span>
          </div>

        </div>
      </div>

      {/* Card Content Section */}
      <div className="flex flex-1 flex-col justify-between p-6">
        
        {/* Title & Description */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Link
                href={`/instructor/courses/${course.id}`}
                className="line-clamp-2 min-h-[3.25rem] text-lg font-bold text-slate-900 transition-colors duration-200 hover:text-indigo-600"
              >
                {course.title}
              </Link>
            </div>

            <CourseActions courseId={course.id} onDeleted={onDeleted} />
          </div>

          <p className="mt-2.5 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-slate-500">
            {course.description || course.shortDescription || "No course description provided."}
          </p>
        </div>

        {/* Stats & Footer Container */}
        <div className="mt-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50/80 p-3 border border-slate-100 text-center">
            
            <div className="px-1">
              <p className="text-xs text-slate-400 font-medium">Price</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {course.price > 0 ? `$${course.price}` : "Free"}
              </p>
            </div>

            <div className="px-1">
              <p className="text-xs text-slate-400 font-medium">Students</p>
              <p className="mt-0.5 text-sm font-bold text-indigo-600">
                {course.studentsCount || 0}
              </p>
            </div>

            <div className="px-1">
              <p className="text-xs text-slate-400 font-medium">Rating</p>
              <p className="mt-0.5 text-sm font-bold text-amber-500">
                ★ {course.rating || 5.0}
              </p>
            </div>

          </div>

          {/* Footer Action */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                (course.status || "").toUpperCase() === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-400"
              }`} />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {course.status || "DRAFT"}
              </span>
            </div>

            <Link
              href={`/instructor/courses/${course.id}/curriculum`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 active:scale-95"
            >
              <span>Curriculum</span>
              <span className="text-indigo-200 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}