import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import AuroraBackground from "@/components/AuroraBackground";
import CursorGlow from "@/components/CursorGlow";
import ScrollMotionBlur from "@/components/ScrollMotionBlur";
import { KineticTitle, ScrollReveal, TiltCard, GamesGlobe, GlitchText } from "@/components/animated";
import { profile } from "@/data/profile";

const Hobbies = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Beyond the Code | {profile.name}</title>
      </Helmet>

      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <CursorGlow />
        <ScrollMotionBlur />
        <AuroraBackground />

        {/* Back Button */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-mono text-sm uppercase tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Return to Portfolio
          </button>
        </div>

        <main className="container mx-auto max-w-5xl px-4 py-32 md:py-48 relative z-10">
          <ScrollReveal from="bottom">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-12 text-gradient">
              <KineticTitle text="Beyond the Code" />
            </h1>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Copy & Image */}
            <div className="space-y-12">
              <ScrollReveal from="left" delay={0.2}>
                <div className="prose prose-invert prose-lg">
                  <p className="text-foreground/80 leading-relaxed font-light">
                    While I am deeply <GlitchText text="career-oriented">career-oriented</GlitchText> and obsessed with building high-performance systems, I firmly believe that the best code is written by developers who have a life outside their IDE. Balance is the ultimate architecture.
                  </p>
                  
                  <p className="text-foreground/80 leading-relaxed font-light">
                    When I'm not untangling complex bugs, you'll likely find me at the <strong className="text-primary font-medium">gym</strong>, challenging my physical limits, or in the kitchen obsessively perfecting my <strong className="text-primary font-medium">pasta recipes</strong>. (I treat cooking exactly like refactoring — iterative improvements until it's flawless).
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal from="left" delay={0.4}>
                <TiltCard maxTilt={3}>
                  <div className="glass-strong rounded-3xl p-2 relative group overflow-hidden border border-white/5 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img 
                      src="/images/hollow_knight.png" 
                      alt="Hollow Knight floating in a cyan and emerald space nebula" 
                      className="rounded-2xl w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass-strong rounded-xl p-4 border border-white/10 backdrop-blur-md">
                        <p className="text-sm font-mono text-primary/90 font-bold mb-1 tracking-wider uppercase">Current Obsession</p>
                        <p className="text-foreground/90 font-medium">Recently conquered Hallownest.</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            </div>

            {/* Right side: Gaming History & Globe */}
            <div className="space-y-12">
              <ScrollReveal from="right" delay={0.3}>
                <div className="glass-strong rounded-3xl p-8 md:p-10 border border-white/5 relative overflow-hidden">
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                  
                  <h3 className="font-display text-2xl font-bold mb-6 text-foreground">
                    <KineticTitle text="The Gaming Vault" />
                  </h3>
                  
                  <p className="text-foreground/80 leading-relaxed font-light mb-8">
                    Competitive gaming wired my brain for high-pressure problem solving. I'm a former <strong className="text-[#8b5cf6] font-medium drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">Diamond-ranked League of Legends</strong> player, where split-second decision making and team coordination were mandatory. Today, I balance sweaty competitive shooters with sweeping single-player masterpieces.
                  </p>

                  <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#020617]/50 border border-white/5 shadow-inner relative">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#020617_100%)] z-10" />
                    <GamesGlobe />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Hobbies;
