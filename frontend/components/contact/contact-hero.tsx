import { Mail, MessageCircle } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
          <MessageCircle className="h-7 w-7 text-indigo-400" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-400">
          Contact PRISM
        </p>

        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          We're here to help
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Have a question, need assistance, or want to share feedback?
          Reach out to the PRISM team and we'll be happy to help.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300">
          <Mail className="h-4 w-4 text-indigo-400" />
          Support when you need it
        </div>
      </div>
    </section>
  );
}