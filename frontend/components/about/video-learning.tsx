export default function VideoLearning() {
  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="aspect-video rounded-3xl bg-slate-800">
            <div className="flex h-full items-center justify-center">
              <span className="rounded-full bg-indigo-600 px-6 py-4 font-semibold text-white">
                Video Learning
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Video Learning
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Learn through engaging video lessons
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              PRISM uses structured video learning to help learners understand
              concepts visually and practically.
            </p>

            <ul className="mt-6 space-y-3 text-slate-300">
              <li>✓ Structured video lessons</li>
              <li>✓ Multiple video quality options</li>
              <li>✓ Resume learning from your previous position</li>
              <li>✓ Captions and learning resources</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}