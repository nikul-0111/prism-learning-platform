
import CourseStatus from "./course-status";
interface CourseTableProps {
  courses?: {
    id: string;
    title: string;
    category: string;
    students: number;
    status: "Published" | "Draft";
  }[];
}

export default function CourseTable({
  courses = [],
}: CourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No courses available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Students</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {course.title}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {course.category}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {course.students}
                </td>

                <td className="px-6 py-4">
                  <CourseStatus status={course.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}