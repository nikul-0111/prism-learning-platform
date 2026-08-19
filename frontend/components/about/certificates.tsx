export default function Certificates() {
  return (
    <section className="bg-indigo-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Certificates
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Celebrate your learning achievements
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Successfully complete eligible courses and receive a digital
              certificate that can be verified through PRISM.
            </p>
          </div>

          <div className="rounded-2xl border-4 border-indigo-100 bg-white p-8 shadow-lg">
            <div className="text-center">
              <p className="text-sm uppercase tracking-widest text-slate-500">
                PRISM
              </p>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Certificate of Completion
              </h3>

              <p className="mt-4 text-slate-500">
                This certificate recognizes successful course completion.
              </p>

              <div className="mx-auto mt-8 h-px max-w-xs bg-slate-200" />

              <p className="mt-6 text-sm text-slate-500">
                Verifiable Achievement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}