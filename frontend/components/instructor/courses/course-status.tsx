interface CourseStatusProps {
  status: "Published" | "Draft";
}

export default function CourseStatus({
  status,
}: CourseStatusProps) {
  const isPublished = status === "Published";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}