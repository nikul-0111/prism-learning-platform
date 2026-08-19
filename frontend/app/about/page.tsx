import AboutHero from "@/components/about/about-hero";
import PlatformIntroduction from "@/components/about/platform-introduction";
import Mission from "@/components/about/mission";
import Vision from "@/components/about/vision";
import WhyPrism from "@/components/about/why-prism";
import PlatformValues from "@/components/about/platform-values";
import LearningExperience from "@/components/about/learning-experience";
import VideoLearning from "@/components/about/video-learning";
import Assessments from "@/components/about/assessments";
import Certificates from "@/components/about/certificates";
import LearningLevels from "@/components/about/learning-levels";
import LearningCategories from "@/components/about/learning-categories";
import LearningPhilosophy from "@/components/about/learning-philosophy";
import AboutCta from "@/components/about/about-cta";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <PlatformIntroduction />
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-2">
        <Mission />
        <Vision />
      </div>
      <WhyPrism />
      <PlatformValues />
      <LearningExperience />
      <VideoLearning />
      <Assessments />
      <Certificates />
      <LearningLevels />
      <LearningCategories />
      <LearningPhilosophy />
      <AboutCta />
    </main>
  );
}
