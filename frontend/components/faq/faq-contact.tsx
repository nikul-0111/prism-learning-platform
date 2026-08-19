import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function FaqContact() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <MessageCircle className="h-7 w-7 text-indigo-600" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Still have questions?
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
            If you couldn't find the answer you were looking for, our support
            team is ready to help.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Contact Support
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}