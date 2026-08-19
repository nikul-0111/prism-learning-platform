"use client";

interface CourseThumbnailProps {
  thumbnail: string;
  onThumbnailChange: (value: string) => void;
}

export default function CourseThumbnail({
  thumbnail,
  onThumbnailChange,
}: CourseThumbnailProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <label
        htmlFor="thumbnail"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Course Thumbnail
      </label>

      <input
        id="thumbnail"
        type="text"
        value={thumbnail}
        onChange={(e) => onThumbnailChange(e.target.value)}
        placeholder="Enter thumbnail URL"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <p className="mt-2 text-xs text-slate-500">
        We will connect the S3/MinIO upload system later.
      </p>
    </section>
  );
}