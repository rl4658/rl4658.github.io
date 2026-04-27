import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { experiences } from "@/data/profile";
import { ScrollReveal, TiltCard, KineticTitle } from "@/components/animated";
import { parseBulletWithCounts } from "@/components/animated/CountUp";
import { useScene } from "@/contexts/SceneContext";

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerSection } = useScene();

  useEffect(() => registerSection("experience", sectionRef), [registerSection]);

  /*
   * Two scroll subscriptions:
   *  - sectionScroll: drives the parallax and timeline-line draw
   *  - per-card scroll handled inside ScrollReveal
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  /* Timeline line "draws" itself as you scroll through the section. */
  const timelineProgress = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 30%"],
  }).scrollYProgress;
  const timelineScaleY = useTransform(timelineProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-4 relative">
      <motion.div style={{ y }} className="container mx-auto max-w-4xl">
        {/* Section Title — kinetic word-by-word reveal. */}
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-center text-gradient">
          <KineticTitle text="Experience" />
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-foreground/60 font-mono text-sm mb-12"
        >
          {"// career.timeline()"}
        </motion.p>

        {/* Timeline */}
        <div className="relative">
          {/*
            Animated timeline line — scaleY is driven by section scroll progress.
            The line literally "draws itself" as you scroll past the cards.
            transform-origin: top so it grows downward.
          */}
          <motion.div
            className="hidden md:block timeline-line"
            style={{ scaleY: timelineScaleY, transformOrigin: "top" }}
          />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <ScrollReveal key={`${exp.company}-${index}`} from="right" intensity={1}>
                <div className="relative md:pl-16">
                  <div className="hidden md:block timeline-dot top-8" />

                  <TiltCard>
                  <motion.div
                    className="glass-strong rounded-3xl p-6 md:p-8"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 60px rgba(6, 182, 212, 0.18)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Briefcase size={16} />
                          {exp.company}
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-1 text-sm text-foreground/70">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-accent" />
                          <span className="font-mono text-xs tracking-wide">{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-accent" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-3">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start gap-3 text-foreground/90"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_hsl(var(--primary))]" />
                          <span className="text-sm md:text-base leading-relaxed">
                            {parseBulletWithCounts(bullet)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  </TiltCard>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ExperienceSection;
