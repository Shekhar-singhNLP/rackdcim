import ScrollBackground from "./components/ScrollBackground";
import LandingNav from "./components/LandingNav";
import Hero from "./components/Hero";
import ArchitecturePipeline from "./components/ArchitecturePipeline";
import BentoGrid from "./components/BentoGrid";
import DeploymentModels from "./components/DeploymentModels";
import ResearchCredibility from "./components/ResearchCredibility";

function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ScrollBackground />
      <LandingNav />
      <Hero />
      <ArchitecturePipeline />
      <BentoGrid />
      <DeploymentModels />
      <ResearchCredibility />
    </div>
  );
}

export default LandingPage;