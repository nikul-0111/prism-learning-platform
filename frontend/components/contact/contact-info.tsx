import {
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    title: "Email",
    value: "support@prismlearning.com",
    description: "Send us your questions anytime.",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 00000 00000",
    description: "Available during support hours.",
  },
  {
    icon: Clock,
    title: "Support Hours",
    value: "Mon - Fri, 9:00 AM - 6:00 PM",
    description: "We're available during business hours.",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "India",
    description: "Serving learners online.",
  },
];

export default function ContactInfo() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactDetails.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-indigo-50 p-3">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 break-words font-medium text-slate-700">
                  {item.value}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}