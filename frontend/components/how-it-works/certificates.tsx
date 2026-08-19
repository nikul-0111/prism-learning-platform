import { Award, CheckCircle2, Download, ShieldCheck } from "lucide-react";

export default function Certificates() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
              <div className="border-4 border-double border-indigo-200 p-8 text-center sm:p-12">
                <Award className="mx-auto h-14 w-14 text-indigo-600" />

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
                  Certificate of Completion
                </p>

                <h3 className="mt-5 text-2xl font-bold text-slate-900">
                  Full Stack Web Development
                </h3>

                <p className="mt-4 text-sm text-slate-500">
                  Successfully completed the course on PRISM Learning
                  Platform.
                </p>

                <div className="mx-auto mt-8 h-px w-32 bg-slate-200" />

                <p className="mt-4 text-sm font-medium text-slate-700">
                  PRISM Learning Platform
                </p>
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500">
                <Download className="h-5 w-5" />
                Download Certificate
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Celebrate Your Achievement
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Earn certificates for completed learning
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Complete your course requirements and celebrate your achievement
              with a certificate that represents your learning journey.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-green-600" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    Proof of completion
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Show that you successfully completed your learning program.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    Recognize your effort
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Keep a record of the skills and courses you have completed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Award className="mt-1 h-6 w-6 shrink-0 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    Celebrate progress
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Every completed course is another milestone in your
                    journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}