export default function PlatformIntroduction() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            What is PRISM?
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A complete learning experience in one platform
          </h2>
        </div>

        <div className="space-y-5 text-lg leading-8 text-slate-600">
          <p>
            PRISM is an online learning platform where learners can discover
            courses, watch structured video lessons, practice through
            assessments, track their learning progress, and earn certificates.
          </p>

          <p>
            The platform brings courses, learning resources, assessments,
            progress tracking, and certificates together into one simple
            learning experience.
          </p>
        </div>
      </div>
    </section>
  );
}