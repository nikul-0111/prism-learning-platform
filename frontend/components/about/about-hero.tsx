export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">
            About PRISM
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Learn. Practice. Grow.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            PRISM is a modern learning platform designed to make high-quality
            education accessible, structured, engaging, and practical.
          </p>
        </div>
      </div>
    </section>
  );
}