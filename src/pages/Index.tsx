import { useState } from "react";
import { Helmet } from "react-helmet";
import AuroraBackground from "@/components/AuroraBackground";
import { GeometricAmbience, CodeParticles } from "@/components/animated";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import EducationSection from "@/components/sections/EducationSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Footer from "@/components/Footer";
import ResumeModal from "@/components/ResumeModal";
import BackToTop from "@/components/BackToTop";
import { profile } from "@/data/profile";

const Index = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>{profile.name} | {profile.tagline}</title>
        <meta
          name="description"
          content={`${profile.name} - ${profile.tagline}. ${profile.about.bio.substring(0, 150)}...`}
        />
        <meta property="og:title" content={`${profile.name} | ${profile.tagline}`} />
        <meta
          property="og:description"
          content={profile.about.bio.substring(0, 150)}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={profile.contact.website} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${profile.name} | ${profile.tagline}`} />
        <meta
          name="twitter:description"
          content={profile.about.bio.substring(0, 150)}
        />
        <link rel="canonical" href={profile.contact.website} />
      </Helmet>

      <div className="relative min-h-screen">
        {/* Animated Background */}
        <AuroraBackground />
        <GeometricAmbience shapeCount={10} colorPalette={["cyan", "purple", "pink"]} />

        {/* Navigation */}
        <NavBar onResumeClick={() => setIsResumeModalOpen(true)} />

        {/* Main Content */}
        <main>
          <HeroSection onResumeClick={() => setIsResumeModalOpen(true)} />
          <CodeParticles count={3} area="section" />
          <AboutSection />
          <CodeParticles count={3} area="section" />
          <ExperienceSection />
          <CodeParticles count={3} area="section" />
          <SkillsSection />
          <CodeParticles count={3} area="section" />
          <EducationSection />
          <CodeParticles count={3} area="section" />
          <ProjectsSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Resume Modal */}
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />

        {/* Back to Top */}
        <BackToTop />
      </div>
    </>
  );
};

export default Index;
