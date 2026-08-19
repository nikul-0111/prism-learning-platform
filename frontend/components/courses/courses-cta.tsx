import Link from "next/link";

export default function CoursesCta() {
  return (
    <section className="bg-indigo-600 py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to start learning?
        </h2>

        <p className="mt-4 text-indigo-100">
          Create your PRISM account and start your learning journey.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          Create Your Account
        </Link>
      </div>
    </section>
  );
}