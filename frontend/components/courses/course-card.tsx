import Link from "next/link";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessons: number;
  rating: number;
  image: string;
}

export default function CourseCard({
  slug,
  title,
  description,
  category,
  level,
  lessons,
  rating,
  image,
}: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
      
      {/* Course Image */}
      <div className="aspect-video overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>

      {/* Course Content */}
      <div className="p-6">

        {/* Category */}
        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {category}
        </span>

        {/* Title */}
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {description}
        </p>

        {/* Rating + Level */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            ⭐ {rating}
          </span>

          <span className="rounded-lg bg-white px-3 py-1 font-medium text-slate-600 shadow-sm">
            {level}
          </span>
        </div>

        {/* Lessons */}
        <div className="mt-3 text-sm font-medium text-slate-500">
          📚 {lessons} Lessons
        </div>

        {/* Button */}
        <Link
          href={`/courses/${slug}`}
          className="mt-6 block rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-md"
        >
          View Course
        </Link>
      </div>
    </article>
  );
}