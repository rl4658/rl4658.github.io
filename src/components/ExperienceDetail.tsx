import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { X, MapPin, Calendar, ExternalLink, ArrowLeft, ArrowRight, Layers, Target, Cpu } from "lucide-react";
import type { Experience } from "@/data/profile";
import { parseBulletWithCounts } from "@/components/animated/CountUp";

/* -------------------------------------------------------------------------- */
/* ExperienceDetail — full-screen deep-dive into one role.                     */
/*                                                                             */
/* Opens with a Framer shared-layout transition from the card (same layoutId), */
/* locks body scroll while mounted, and closes on ✕, backdrop click or Esc.    */
/* Content: overview → "What I built" (count-up numbers) → impact tiles →      */
/* stack → company link → prev/next role. URL state (?exp=slug) is owned by    */
/* the page; this component only receives callbacks.                           */
/* -------------------------------------------------------------------------- */

interface ExperienceDetailProps {
  experience: Experience;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const stagger: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.18 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

const ExperienceDetail = ({ experience, index, total, onClose, onPrev, onNext }: ExperienceDetailProps) => {
  /* Lock page scroll and wire keyboard shortcuts while open. */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const host = (() => {
    try {
      return new URL(experience.website).hostname.replace(/^www\./, "");
    } catch {
      return experience.website;
    }
  })();

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="exp-detail-title">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/85"
      />

      {/* Panel — shares layoutId with the card it grew out of. */}
      <motion.div
        layoutId={`exp-${experience.slug}`}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
        className="absolute inset-3 md:inset-8 lg:inset-x-[12%] lg:inset-y-10 glass-strong rounded-3xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 md:p-7 border-b border-white/5">
          <div className="flex items-start gap-4 min-w-0">
            <img
              src={experience.logoUrl}
              alt={`${experience.company} logo`}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-white/10 object-contain bg-white/95 p-2 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/45 mb-1">
                {`// role ${String(index + 1).padStart(2, "0")} of ${String(total).padStart(2, "0")}`}
              </div>
              <h2 id="exp-detail-title" className="font-display text-2xl md:text-4xl font-bold leading-tight text-foreground">
                {experience.role}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <a
                  href={experience.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4"
                >
                  {experience.company}
                  <ExternalLink size={14} />
                </a>
                <span className="inline-flex items-center gap-1.5 text-foreground/70">
                  <Calendar size={14} className="text-accent" />
                  <span className="font-mono text-xs tracking-wide">{experience.period}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-foreground/70">
                  <MapPin size={14} className="text-accent" />
                  {experience.location}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-foreground/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-10">
          {/* Overview */}
          <motion.section custom={0} variants={stagger} initial="hidden" animate="visible">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-3xl">
              {experience.overview}
            </p>
          </motion.section>

          {/* What I built */}
          <motion.section custom={1} variants={stagger} initial="hidden" animate="visible">
            <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              <Layers size={14} />
              What I built
            </h3>
            <ul className="space-y-4">
              {experience.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/90 text-sm md:text-base leading-relaxed">
                  <span className="font-mono text-primary/70 text-xs mt-1.5 shrink-0 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{parseBulletWithCounts(h)}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Impact tiles */}
          {experience.impact && experience.impact.length > 0 && (
            <motion.section custom={2} variants={stagger} initial="hidden" animate="visible">
              <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
                <Target size={14} />
                Impact
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {experience.impact.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-primary/15 bg-primary/5 p-4"
                  >
                    <div className="font-display text-2xl md:text-3xl font-bold text-gradient tabular-nums">
                      {m.value}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-foreground/65 leading-snug">{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Stack */}
          <motion.section custom={3} variants={stagger} initial="hidden" animate="visible">
            <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              <Cpu size={14} />
              Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {experience.stack.map((s) => (
                <span key={s} className="pill text-xs md:text-sm">
                  {s}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Company link */}
          <motion.section custom={4} variants={stagger} initial="hidden" animate="visible">
            <a
              href={experience.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
            >
              Visit {host}
              <ExternalLink size={16} />
            </a>
          </motion.section>
        </div>

        {/* Footer — prev / next */}
        <div className="flex items-center justify-between gap-3 p-4 md:px-7 border-t border-white/5 text-sm">
          <button
            onClick={onPrev}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-foreground/10 transition-colors text-foreground/80"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Previous role</span>
          </button>
          <span className="font-mono text-xs text-foreground/40 tracking-widest">
            ← → to navigate · esc to close
          </span>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-foreground/10 transition-colors text-foreground/80"
          >
            <span className="hidden sm:inline">Next role</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExperienceDetail;
