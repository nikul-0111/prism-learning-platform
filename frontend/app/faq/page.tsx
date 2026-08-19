import FaqHero from "@/components/faq/faq-hero";
import GeneralFaq from "@/components/faq/general-faq";
import CourseFaq from "@/components/faq/course-faq";
import AccountFaq from "@/components/faq/account-faq";
import TechnicalFaq from "@/components/faq/technical-faq";
import FaqContact from "@/components/faq/faq-contact";
import FaqCta from "@/components/faq/faq-cta";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <FaqHero />

      {/* FAQ Sections */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        {/* Background decoration */}
        <div className="pointer-events-none absolute left-0 top-20 -z-0 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-[40%] -z-0 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {/* General */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10">
              <GeneralFaq />
            </section>

            {/* Courses */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10">
              <CourseFaq />
            </section>

            {/* Account */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10">
              <AccountFaq />
            </section>

            {/* Technical */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10">
              <TechnicalFaq />
            </section>
          </div>
        </div>
      </section>

      {/* Contact */}
      <FaqContact />

      {/* CTA */}
      <FaqCta />
    </main>
  );
}