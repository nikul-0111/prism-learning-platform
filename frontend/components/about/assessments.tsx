const features = [
  "Multiple choice questions",
  "Multiple selection questions",
  "True / False questions",
  "Short answer questions",
  "Timed assessments",
  "Progress evaluation",
];

export default function Assessments() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Assessments
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Learn and test your knowledge
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            PRISM assessments help learners check their understanding and
            measure their progress throughout a course.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-xl border border-slate-200 p-5 text-slate-700"
            >
              ✓ {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}