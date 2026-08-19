import HowItWorksHero from "@/components/how-it-works/how-it-works-hero";
import StepByStep from "@/components/how-it-works/step-by-step";
import LearningJourney from "@/components/how-it-works/learning-journey";
import LearningProcess from "@/components/how-it-works/learning-process";
import CourseDiscovery from "@/components/how-it-works/course-discovery";
import VideoLearning from "@/components/how-it-works/video-learning";
import Assessments from "@/components/how-it-works/assessments";
import ProgressTracking from "@/components/how-it-works/progress-tracking";
import Certificates from "@/components/how-it-works/certificates";
import PlatformBenefits from "@/components/how-it-works/platform-benefits";
import HowItWorksCta from "@/components/how-it-works/how-it-works-cta";

export default function HowItWorksPage() {
  return (
    <main>
      <HowItWorksHero />
      <StepByStep />
      <LearningJourney />
      <LearningProcess />
      <CourseDiscovery />
      <VideoLearning />
      <Assessments />
      <ProgressTracking />
      <Certificates />
      <PlatformBenefits />
      <HowItWorksCta />
    </main>
  );
}
