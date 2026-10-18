import ScrollBackground from "./components/ScrollBackground";
import LandingNav from "./components/LandingNav";
import Hero from "./components/Hero";
import ResearchInspiration from "./components/ResearchInspiration";
import ArchitecturePipeline from "./components/ArchitecturePipeline";
import BentoGrid from "./components/BentoGrid";

function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ScrollBackground />
      <LandingNav />
      <Hero />
      <ResearchInspiration />
      <ArchitecturePipeline />
      <BentoGrid />
    </div>
  );
}

export default LandingPage;