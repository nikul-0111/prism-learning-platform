const categories = [
  "Web Development",
  "Programming",
  "Data & Analytics",
  "Design",
  "Business",
  "Technology",
];

export default function LearningCategories() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Course Categories
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Explore different areas of learning
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}