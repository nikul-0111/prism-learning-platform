import Hero from "@/components/home/hero";
import PlatformOverview from "@/components/home/platform-overview";
import WhyPrism from "@/components/home/why-prism";
import FeaturedCourses from "@/components/home/featured-courses";
import HowPrismWorks from "@/components/home/how-prism-works";
import LearningExperience from "@/components/home/learning-experience";
import Certificates from "@/components/home/certificates";
import Testimonials from "@/components/home/testimonials";
import CtaSection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PlatformOverview />
      <WhyPrism />
      <FeaturedCourses />
      <HowPrismWorks />
      <LearningExperience />
      <Certificates />
      <Testimonials />
      {/* <CtaSection /> */}
    </main>
  );
}