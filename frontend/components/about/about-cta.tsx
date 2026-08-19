import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="bg-indigo-600 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to start learning with PRISM?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
          Explore our courses and discover learning experiences designed to
          help you build knowledge and practical skills.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/courses"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Explore Courses
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}