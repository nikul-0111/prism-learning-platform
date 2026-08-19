const values = [
  {
    title: "Quality",
    description:
      "We focus on creating a learning experience that is useful, clear, and reliable.",
  },
  {
    title: "Accessibility",
    description:
      "Learning should be available to people regardless of where they are.",
  },
  {
    title: "Practical Learning",
    description:
      "Courses should help learners build knowledge that can be applied in real situations.",
  },
  {
    title: "Continuous Improvement",
    description:
      "We continuously improve the platform and learning experience.",
  },
];

export default function PlatformValues() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Our Values
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            What PRISM stands for
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="text-xl font-semibold text-slate-900">
                {value.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}