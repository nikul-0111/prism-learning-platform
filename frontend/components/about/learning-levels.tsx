const levels = [
  {
    title: "Beginner",
    description: "Start with the fundamentals and build a strong foundation.",
  },
  {
    title: "Intermediate",
    description: "Improve your existing skills with deeper concepts.",
  },
  {
    title: "Advanced",
    description: "Explore complex concepts and strengthen your expertise.",
  },
];

export default function LearningLevels() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Learning Levels
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Learn at the right level for you
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {levels.map((level) => (
            <div
              key={level.title}
              className="rounded-2xl border border-slate-200 p-7"
            >
              <h3 className="text-xl font-semibold text-slate-900">
                {level.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {level.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}