import CurriculumBuilder from "@/components/instructor/curriculum/curriculum-builder";

interface CurriculumPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CurriculumPage({
  params,
}: CurriculumPageProps) {
  const { courseId } = await params;

  return (
    <CurriculumBuilder
      courseId={courseId}
      courseTitle="Course Curriculum"
    />
  );
}