export default function LearningPhilosophy() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Our Learning Philosophy
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Learn by understanding, practicing, and applying
        </h2>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          PRISM believes that learning should go beyond watching videos.
          Learners should understand concepts, practice what they learn,
          evaluate their knowledge, and apply their skills.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Understand</h3>
            <p className="mt-2 text-sm text-slate-600">
              Build strong conceptual knowledge.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Practice</h3>
            <p className="mt-2 text-sm text-slate-600">
              Test your knowledge through assessments.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Apply</h3>
            <p className="mt-2 text-sm text-slate-600">
              Use your skills in practical situations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}