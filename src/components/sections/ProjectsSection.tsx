import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Trophy, ArrowRight, Sparkles, ExternalLink, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects, awards } from "@/data/profile";
import { ScrollReveal, TiltCard, DecryptTitle } from "@/components/animated";
import GlitchText from "@/components/animated/GlitchText";
import { useScene } from "@/contexts/SceneContext";

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerSection } = useScene();
  const navigate = useNavigate();

  useEffect(() => registerSection("projects", sectionRef), [registerSection]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-4 relative">
      <motion.div style={{ y }} className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles size={13} />
            Engineering Showcases & Demos
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-center text-gradient">
            <DecryptTitle text="Projects & Recognitions" />
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-foreground/60 font-mono text-sm max-w-lg mx-auto"
          >
            {"// live playable widgets • codebases • technical achievements"}
          </motion.p>
        </div>

        {/* Dedicated Projects Page Portal Banner */}
        <ScrollReveal from="up" intensity={1}>
          <div className="mb-10">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="glass-strong rounded-3xl p-8 relative overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(255,255,255,0.06)] group cursor-pointer"
              onClick={() => navigate("/projects")}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5 text-neutral-300 font-mono text-xs uppercase tracking-widest mb-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Interactive Showcase Page
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Explore Dedicated Projects Lab
                  </h3>
                  <p className="text-foreground/70 text-sm md:text-base mt-2 max-w-xl font-light">
                    Test live working widgets before exploring the code: real-time AI pose estimation demos, interactive sorting visualizer, Spotify playlist generator studio, and multi-threaded terminal simulations.
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/projects");
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-sm tracking-wide flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:bg-neutral-200 transition-all shrink-0 group-hover:translate-x-1"
                >
                  <Play size={16} className="fill-slate-950" />
                  <span>Launch Projects Page</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Grid Preview of Featured Projects & Awards */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.slice(0, 2).map((project, index) => (
            <ScrollReveal
              key={project.id}
              from={index % 2 === 0 ? "left" : "right"}
              intensity={1}
            >
              <TiltCard className="h-full">
                <motion.div
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 60px rgba(6, 182, 212, 0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-strong rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between border border-white/5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Code size={18} />
                        <span className="font-mono font-medium text-xs md:text-sm">{project.tech}</span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-300/80 bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                      <GlitchText text={project.name}>{project.name}</GlitchText>
                    </h3>
                    <p className="text-foreground/70 text-xs md:text-sm mb-4 line-clamp-2">
                      {project.tagline}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {project.bullets.slice(0, 2).map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start gap-2.5 text-foreground/80 text-xs md:text-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_hsl(var(--primary))]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary hover:underline flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={13} />
                      <span>GitHub Repo</span>
                    </a>
                    <button
                      onClick={() => navigate("/projects")}
                      className="text-xs font-mono text-foreground/60 hover:text-foreground flex items-center gap-1"
                    >
                      <span>Interactive Demo</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}

          {/* Awards Card */}
          <ScrollReveal from="right" intensity={1} className="md:col-span-2">
            <TiltCard className="h-full">
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 60px rgba(16, 185, 129, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-strong rounded-3xl p-6 md:p-8 h-full border border-white/5"
              >
                <div className="flex items-center gap-2 text-accent mb-4">
                  <Trophy size={20} />
                  <span className="font-mono font-semibold text-base">Honors & Awards</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {awards.map((award, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="w-2 h-2 rounded-full bg-accent mb-2 shadow-[0_0_10px_hsl(var(--accent))]" />
                        <p className="font-semibold text-foreground text-sm leading-snug">{award.title}</p>
                        {award.tech && (
                          <p className="text-xs text-foreground/60 mt-1 font-mono">{award.tech}</p>
                        )}
                      </div>
                      <p className="text-xs text-accent/80 font-mono mt-3 font-semibold">{award.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
