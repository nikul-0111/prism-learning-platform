import {
  Quote,
  Star,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

const testimonials = [
  {
    name: "Aarav Shah",
    role: "Computer Science Student",
    initials: "AS",
    rating: 5,
    message:
      "PRISM made my learning journey much more organized. I can easily see my courses, track my progress, and know exactly what I need to learn next.",
    course: "Full Stack Web Development",
  },
  {
    name: "Diya Patel",
    role: "Web Development Student",
    initials: "DP",
    rating: 5,
    message:
      "I really like the simple dashboard and structured courses. The progress tracking keeps me motivated to complete my lessons regularly.",
    course: "React Development",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineering Student",
    initials: "RM",
    rating: 5,
    message:
      "The combination of courses, assessments, progress tracking, and certificates makes PRISM feel like a complete learning platform.",
    course: "JavaScript Fundamentals",
  },
  {
    name: "Meera Joshi",
    role: "Frontend Development Student",
    initials: "MJ",
    rating: 5,
    message:
      "PRISM gives me a clear learning path instead of making me search for everything myself. It is easy to use and keeps all my learning in one place.",
    course: "Frontend Development",
  },
  {
    name: "Dev Patel",
    role: "Backend Development Student",
    initials: "DP",
    rating: 5,
    message:
      "The assessment and progress features helped me understand where I was improving and which topics I needed to practice more.",
    course: "Node.js & Express",
  },
  {
    name: "Kavya Shah",
    role: "Programming Student",
    initials: "KS",
    rating: 5,
    message:
      "Earning a certificate after completing a course gives me a great sense of achievement. PRISM makes the entire process simple and motivating.",
    course: "Programming Fundamentals",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="absolute left-1/2 top-0 -z-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <GraduationCap className="h-4 w-4" />
            Student Experiences
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Loved by Learners.
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Built for Your Growth.
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            See how students use PRISM to organize their learning, build new
            skills, track their progress, and achieve their goals.
          </p>
        </div>

        {/* Overall Rating */}
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="text-4xl font-bold text-gray-900">4.9</p>

            <div className="mt-1 flex justify-center gap-1 sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>

          <div className="mt-4 h-px w-full bg-gray-200 sm:mt-0 sm:h-12 sm:w-px" />

          <div className="text-center sm:text-left">
            <p className="font-semibold text-gray-900">
              Excellent Learning Experience
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Trusted by students learning with PRISM
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              {/* Quote Icon */}
              <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Quote className="h-5 w-5" />
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Message */}
              <p className="mt-5 min-h-[120px] text-sm leading-7 text-gray-600">
                “{testimonial.message}”
              </p>

              {/* Course */}
              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-blue-600">
                <CheckCircle2 className="h-4 w-4" />
                Completed {testimonial.course}
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gray-100" />

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                  {testimonial.initials}
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-gray-900">
                      {testimonial.name}
                    </h3>

                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">1K+</p>
            <p className="mt-2 text-sm text-gray-500">
              Active Learners
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">50+</p>
            <p className="mt-2 text-sm text-gray-500">
              Learning Courses
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">95%</p>
            <p className="mt-2 text-sm text-gray-500">
              Student Satisfaction
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}