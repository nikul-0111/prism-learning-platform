import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

const journeyItems = [
  {
    icon: BookOpen,
    title: "Learn at your own pace",
    text: "Study whenever it works best for you without unnecessary pressure.",
  },
  {
    icon: Clock,
    title: "Build a consistent routine",
    text: "Return to your courses regularly and keep your learning journey moving.",
  },
  {
    icon: Target,
    title: "Focus on your goals",
    text: "Choose learning paths that help you build practical and relevant skills.",
  },
  {
    icon: CheckCircle2,
    title: "Complete milestones",
    text: "Finish lessons and assessments to move forward with confidence.",
  },
];

export default function LearningJourney() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Your Journey
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Make learning part of your routine
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            PRISM is designed to help you make steady progress without making
            learning complicated.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {journeyItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="h-fit rounded-xl bg-indigo-50 p-3">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}