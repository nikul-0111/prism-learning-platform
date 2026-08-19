const benefits = [
  {
    title: "Structured Courses",
    description:
      "Learn through organized courses divided into clear sections and lessons.",
  },
  {
    title: "Video-Based Learning",
    description:
      "Learn through high-quality video lessons designed for practical understanding.",
  },
  {
    title: "Practice & Assessments",
    description:
      "Test your understanding through quizzes and assessments.",
  },
  {
    title: "Track Your Progress",
    description:
      "Keep track of completed lessons and overall course progress.",
  },
  {
    title: "Certificates",
    description:
      "Complete eligible courses and receive verifiable certificates.",
  },
  {
    title: "Learn at Your Pace",
    description:
      "Study when you want and continue learning from where you stopped.",
  },
];

export default function WhyPrism() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Why PRISM
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Everything you need for a better learning experience
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-lg font-semibold text-white">
                {benefit.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}