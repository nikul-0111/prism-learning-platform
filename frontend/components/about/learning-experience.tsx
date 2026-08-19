



export default function LearningExperience() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Learning Experience
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Designed around the learner
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              PRISM combines video lessons, structured course content,
              assessments, progress tracking, notes, and certificates to
              provide a complete learning journey.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8">
            <div className="space-y-6">
              {[
                "Discover a course",
                "Learn through structured lessons",
                "Practice with assessments",
                "Track your progress",
                "Complete the course",
                "Earn your certificate",
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <span className="text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}