import { PlayCircle, Video, Volume2 } from "lucide-react";

export default function VideoLearning() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-2xl">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-900">
              <div className="flex h-full items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
                  <PlayCircle className="h-10 w-10 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-300" />
                <span className="text-sm">Course Video</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Volume2 className="h-4 w-4" />
                HD Learning
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Learn Visually
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Learn through engaging video lessons
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Understand concepts through structured lessons and video-based
              learning content designed to make difficult topics easier to
              understand.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Structured lessons",
                "Easy-to-follow explanations",
                "Learn whenever you want",
                "Revisit lessons when needed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <span className="block h-2 w-2 rounded-full bg-green-600" />
                  </div>

                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}