import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuroraBackground from "@/components/AuroraBackground";
import CursorGlow from "@/components/CursorGlow";
import { ChapterStrip, SceneWipe, SectionCutSentinel, SkillsDonut } from "@/components/animated";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import EducationSection from "@/components/sections/EducationSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Footer from "@/components/Footer";
import ResumeModal from "@/components/ResumeModal";
import ExperienceDetail from "@/components/ExperienceDetail";
import BackToTop from "@/components/BackToTop";
import IntroOverlay from "@/components/intro/IntroOverlay";
import { IntroProvider, useIntro } from "@/contexts/IntroContext";
import { SceneProvider, useScene } from "@/contexts/SceneContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { trackEvent } from "@/lib/analytics";
import { profile, experiences } from "@/data/profile";

const SITE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined)?.trim();

const Index = () => {
  return (
    <IntroProvider>
      <SceneProvider>
        <IndexInner />
      </SceneProvider>
    </IntroProvider>
  );
};

const IndexInner = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { phase, replayIntro } = useIntro();
  const { isWarping } = useScene();
  const prefersReducedMotion = useReducedMotion();

  /* Body content fades in once the dive completes and hides during the warp. */
  const bodyVisible = phase === "done" && !isWarping;

  /* Force-close the resume modal whenever we leave the "done" phase. */
  useEffect(() => {
    if (phase !== "done") setIsResumeModalOpen(false);
  }, [phase]);

  /* ---------------------------------------------------------------------- */
  /* Experience detail view — URL is the source of truth (?exp=<slug>).      */
  /* Opening pushes a history entry so the browser Back button closes it;   */
  /* closing via the UI pops that entry instead of pushing another one.      */
  /* ---------------------------------------------------------------------- */
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const openedViaUiRef = useRef(false);

  const activeSlug = params.get("exp");
  const activeIndex = activeSlug ? experiences.findIndex((e) => e.slug === activeSlug) : -1;
  const activeExperience = activeIndex >= 0 ? experiences[activeIndex] : null;

  const openExperience = useCallback(
    (slug: string) => {
      openedViaUiRef.current = true;
      setParams({ exp: slug });
      trackEvent("experience_open", { slug });
    },
    [setParams],
  );

  const closeExperience = useCallback(() => {
    if (openedViaUiRef.current) {
      openedViaUiRef.current = false;
      navigate(-1);
    } else {
      setParams({}, { replace: true });
    }
  }, [navigate, setParams]);

  const stepExperience = useCallback(
    (delta: number) => {
      if (activeIndex < 0) return;
      const next = (activeIndex + delta + experiences.length) % experiences.length;
      setParams({ exp: experiences[next].slug }, { replace: true });
      trackEvent("experience_open", { slug: experiences[next].slug, via: "arrow" });
    },
    [activeIndex, setParams],
  );
  const prevExperience = useCallback(() => stepExperience(-1), [stepExperience]);
  const nextExperience = useCallback(() => stepExperience(1), [stepExperience]);

  return (
    <>
      <Helmet>
        <title>Raymond's Portfolio</title>
        <meta
          name="description"
          content={`${profile.name} - ${profile.tagline}. ${profile.about.bio.substring(0, 150)}...`}
        />
        {SITE_VERIFICATION && <meta name="google-site-verification" content={SITE_VERIFICATION} />}
        <meta property="og:title" content={`${profile.name} | ${profile.tagline}`} />
        <meta property="og:description" content={profile.about.bio.substring(0, 150)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={profile.contact.website} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${profile.name} | ${profile.tagline}`} />
        <meta name="twitter:description" content={profile.about.bio.substring(0, 150)} />
        <link rel="canonical" href={profile.contact.website} />
      </Helmet>

      <div className="relative min-h-screen">
        <CursorGlow />

        {/* Persistent WebGL layer: shader backdrop + donut + stars. Null for reduced motion. */}
        <SkillsDonut rotationSpeed={0.003} />
        {/* Reduced-motion users get the cheap CSS aurora instead of the shader. */}
        {prefersReducedMotion && <AuroraBackground />}

        <IntroOverlay />

        <AnimatePresence initial={false}>
          {bodyVisible && (
            <motion.div
              key="portfolio-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChapterStrip />
              <SceneWipe />

              <NavBar
                onResumeClick={() => setIsResumeModalOpen(true)}
                onLogoClick={replayIntro}
              />

              <main>
                <HeroSection onResumeClick={() => setIsResumeModalOpen(true)} />
                <SectionCutSentinel />
                <AboutSection />
                <SectionCutSentinel />
                <ExperienceSection onOpen={openExperience} />
                <SectionCutSentinel />
                <SkillsSection />
                <SectionCutSentinel />
                <EducationSection />
                <SectionCutSentinel />
                <ProjectsSection />
              </main>

              <Footer />

              <ResumeModal
                isOpen={isResumeModalOpen}
                onClose={() => setIsResumeModalOpen(false)}
              />

              <AnimatePresence>
                {activeExperience && (
                  <ExperienceDetail
                    key={activeExperience.slug}
                    experience={activeExperience}
                    index={activeIndex}
                    total={experiences.length}
                    onClose={closeExperience}
                    onPrev={prevExperience}
                    onNext={nextExperience}
                  />
                )}
              </AnimatePresence>

              <BackToTop />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Index;
