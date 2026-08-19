import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId } = await params;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href={`/instructor/courses/${courseId}/curriculum`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Curriculum
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Lesson Preview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your lesson content from the Curriculum Builder tab.
          </p>
        </div>
      </div>
    </div>
  );
}
