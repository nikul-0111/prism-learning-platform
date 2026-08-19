import ContactHero from "@/components/contact/contact-hero";
import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import SupportOptions from "@/components/contact/support-options";
import ContactFaq from "@/components/contact/contact-faq";
import ContactCta from "@/components/contact/contact-cta";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}
      <ContactHero />

      {/* =====================================================
          CONTACT SECTION
      ====================================================== */}
      <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">

        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              Contact Us
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              We&apos;re here to help
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Have a question about courses, your account, payments, or
              technical support? Send us a message and our team will help you.
            </p>

          </div>

          {/* Contact cards */}
          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">

            {/* Contact information */}
            <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <ContactInfo />
            </div>

            {/* Contact form */}
            <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          SUPPORT OPTIONS
      ====================================================== */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Support
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose how we can help
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Select the support category that best matches your question.
            </p>

          </div>

          <SupportOptions />

        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}
      <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              FAQ
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Find answers to some of the most common questions from PRISM
              learners.
            </p>

          </div>

          <ContactFaq />

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <ContactCta />

    </main>
  );
}