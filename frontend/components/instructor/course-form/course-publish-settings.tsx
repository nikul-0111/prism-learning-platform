"use client";

interface CoursePublishSettingsProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export default function CoursePublishSettings({
  status,
  onStatusChange,
}: CoursePublishSettingsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Publish Settings
      </h2>

      <div className="mt-5 space-y-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <input
            type="radio"
            name="status"
            value="DRAFT"
            checked={status === "DRAFT"}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-4 w-4"
          />

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Draft
            </p>

            <p className="text-xs text-slate-500">
              Course is not visible to students.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <input
            type="radio"
            name="status"
            value="PUBLISHED"
            checked={status === "PUBLISHED"}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-4 w-4"
          />

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Published
            </p>

            <p className="text-xs text-slate-500">
              Course can be visible in the catalogue.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}