import { useEffect, useMemo, useRef } from "react";
import { motion, motionValue } from "framer-motion";
import { MapPin, Calendar, ExternalLink, ArrowUpRight } from "lucide-react";
import { experiences, type Experience } from "@/data/profile";
import { ScrollReveal, DecryptTitle } from "@/components/animated";
import { useScene } from "@/contexts/SceneContext";

/* -------------------------------------------------------------------------- */
/* ExperienceSection — a "deck" of stacking cards.                             */
/*                                                                             */
/* On desktop every card is `position: sticky`; as the next card scrolls up    */
/* underneath, the previous one scales down slightly and dims, so the roles    */
/* stack like a deck being dealt. The scale/dim values are MotionValues        */
/* written from one rAF-coalesced scroll listener — no per-frame React         */
/* renders. Clicking a card opens the ExperienceDetail view (owned by Index).   */
/* -------------------------------------------------------------------------- */

const STICKY_TOP_PX = 104;   // matches --deck-top (6.5rem)
const STACK_OFFSET_PX = 14;  // each successive card sticks a little lower → visible stack edge
const MAX_SHRINK = 0.06;
const MAX_DIM = 0.55;

interface ExperienceSectionProps {
  onOpen: (slug: string) => void;
}

const ExperienceSection = ({ onOpen }: ExperienceSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerSection } = useScene();
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => registerSection("experience", sectionRef), [registerSection]);

  /* One scale + one dim MotionValue per card, created once (no hooks in a loop). */
  const scales = useMemo(() => experiences.map(() => motionValue(1)), []);
  const dims = useMemo(() => experiences.map(() => motionValue(0)), []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let rafPending = false;

    const compute = () => {
      rafPending = false;
      if (!mq.matches) {
        scales.forEach((s) => s.set(1));
        dims.forEach((d) => d.set(0));
        return;
      }
      for (let i = 0; i < experiences.length - 1; i++) {
        const current = slotRefs.current[i];
        const next = slotRefs.current[i + 1];
        if (!current || !next) continue;
        const stickTop = STICKY_TOP_PX + i * STACK_OFFSET_PX;
        const cardHeight = current.getBoundingClientRect().height;
        const nextTop = next.getBoundingClientRect().top;
        /* 0 when the next card is still below this one, 1 when it fully covers it. */
        const p = Math.min(1, Math.max(0, (stickTop + cardHeight - nextTop) / cardHeight));
        scales[i].set(1 - p * MAX_SHRINK);
        dims[i].set(p * MAX_DIM);
      }
      scales[experiences.length - 1].set(1);
      dims[experiences.length - 1].set(0);
    };

    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scales, dims]);

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-center text-gradient">
          <DecryptTitle text="Experience" />
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-foreground/60 font-mono text-sm mb-12"
        >
          {"// click a role to open the full case study"}
        </motion.p>

        <div className="space-y-6 md:space-y-10">
          {experiences.map((exp, i) => (
            <div
              key={exp.slug}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className="deck-card"
              style={{ ["--deck-top" as string]: `${STICKY_TOP_PX + i * STACK_OFFSET_PX}px` }}
            >
              <ScrollReveal from="up" intensity={0.8} flat>
                <motion.div style={{ scale: scales[i] }}>
                  <ExperienceCard exp={exp} index={i} onOpen={onOpen} />
                  {/* Dim overlay — opacity only, no filters. */}
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 rounded-3xl bg-background pointer-events-none"
                    style={{ opacity: dims[i] }}
                  />
                </motion.div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */

const ExperienceCard = ({
  exp,
  index,
  onOpen,
}: {
  exp: Experience;
  index: number;
  onOpen: (slug: string) => void;
}) => {
  const open = () => onOpen(exp.slug);

  return (
    <motion.article
      layoutId={`exp-${exp.slug}`}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group glass-strong rounded-3xl p-6 md:p-8 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
      aria-label={`${exp.role} at ${exp.company} — open details`}
    >
      {/* Index watermark */}
      <span
        aria-hidden
        className="absolute -top-3 right-6 font-display text-7xl md:text-8xl font-black text-white/[0.035] select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-700"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div className="flex items-start gap-4 min-w-0">
          <img
            src={exp.logoUrl}
            alt={`${exp.company} logo`}
            loading="lazy"
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-white/10 shadow-lg object-contain bg-white/95 shrink-0 p-1.5"
          />
          <div className="min-w-0">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1 leading-tight">
              {exp.role}
            </h3>
            <a
              href={exp.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4"
            >
              {exp.company}
              <ExternalLink size={14} className="opacity-70" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1 text-sm text-foreground/70 shrink-0">
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

      {/* Overview */}
      <p className="relative text-foreground/80 leading-relaxed text-sm md:text-base mb-6">{exp.overview}</p>

      {/* Stack + CTA */}
      <div className="relative flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
        {exp.stack.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium tracking-wide"
          >
            {skill}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-foreground/60 group-hover:text-primary transition-colors">
          View details
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.article>
  );
};

export default ExperienceSection;
