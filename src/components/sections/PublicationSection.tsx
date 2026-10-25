import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ExternalLink, Copy, Check, Cpu, Eye, Microscope, Sparkles, Layers } from "lucide-react";
import { publication, profile } from "@/data/profile";
import { ScrollReveal, TiltCard, DecryptTitle } from "@/components/animated";
import { useScene } from "@/contexts/SceneContext";

const cardHover = {
  y: -6,
  boxShadow: "0 20px 60px rgba(6, 182, 212, 0.2)",
};

const PublicationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { registerSection } = useScene();
  const [copied, setCopied] = useState(false);
  const [selectedLed, setSelectedLed] = useState<number>(12); // center LED in 5x5 matrix
  const [showMtfExpanded, setShowMtfExpanded] = useState(true);

  useEffect(() => registerSection("publication", sectionRef), [registerSection]);

  const copyBibtex = () => {
    navigator.clipboard.writeText(publication.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 5x5 LED array indices (0..24), center is 12
  const ledMatrix = Array.from({ length: 25 }, (_, i) => i);

  return (
    <section id="publication" ref={sectionRef} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest mb-4">
            <BookOpen size={13} />
            Peer-Reviewed Academic Research
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-center text-gradient">
            <DecryptTitle text="Research & Publication" />
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-foreground/60 font-mono text-sm max-w-xl mx-auto"
          >
            {"// computational microscopy • fourier optics • raspberry pi hardware"}
          </motion.p>
        </div>

        {/* Main Publication Card */}
        <ScrollReveal from="up" intensity={1}>
          <TiltCard maxTilt={3}>
            <motion.div
              whileHover={cardHover}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden border border-white/10"
            >
              {/* Subtle ambient gradient flare */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-semibold">
                    SPIE BiOS · Photonics West
                  </span>
                  <span className="font-mono text-xs text-foreground/50">
                    DOI: {publication.doi}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-medium hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <span>Read on SPIE Digital Library</span>
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={copyBibtex}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary text-foreground text-xs font-mono transition-colors border border-border/40"
                    title="Copy BibTeX Citation"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? "Copied BibTeX!" : "Cite"}</span>
                  </button>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mt-6 mb-6">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                  {publication.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-foreground/70 font-mono">
                  <span className="text-primary font-semibold">Raymond Li</span>
                  <span>•</span>
                  <span>Robarts Research Institute & Western University</span>
                  <span>•</span>
                  <span className="text-foreground/50">SPIE Proceedings Vol. 12832</span>
                </div>
              </div>

              {/* Abstract */}
              <div className="glass rounded-2xl p-5 md:p-6 mb-8 text-foreground/80 leading-relaxed text-sm md:text-base border border-white/5">
                <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-2">
                  <Eye size={14} />
                  <span>Abstract</span>
                </div>
                <p className="text-justify font-light text-foreground/85">
                  {publication.abstract}
                </p>
              </div>

              {/* Key Impact Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {publication.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center text-center group hover:border-white/30 transition-colors"
                  >
                    <span className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 mb-1">
                      {metric.value}
                    </span>
                    <span className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Interactive Fourier Optics & Synthetic Aperture Visualizer */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 text-neutral-300 font-mono text-xs uppercase tracking-wider">
                      <Microscope size={15} />
                      <span>Interactive Synthetic Aperture & LED Illumination Angle Lab</span>
                    </div>
                    <p className="text-xs text-foreground/60 mt-1">
                      Click different LEDs in the array below to observe how tilted illumination shifts high-frequency spatial spectra into the camera objective.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMtfExpanded(!showMtfExpanded)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-foreground/70 transition-colors border border-white/10"
                    >
                      {showMtfExpanded ? "Mode: MTF Synthesis" : "Mode: Single Pupil"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: 5x5 LED Matrix Controller */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-widest mb-3">
                      Addressable LED Illumination Matrix (5x5)
                    </span>
                    <div className="grid grid-cols-5 gap-2.5 p-4 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
                      {ledMatrix.map((idx) => {
                        const row = Math.floor(idx / 5) - 2;
                        const col = (idx % 5) - 2;
                        const isSelected = selectedLed === idx;
                        const isCenter = idx === 12;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedLed(idx)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-110 font-bold"
                                : isCenter
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/40"
                                : "bg-white/5 border border-white/10 hover:border-white/40 hover:bg-white/10"
                            }`}
                            title={`LED (${col}, ${row})`}
                          >
                            <span className="text-[9px] font-mono">
                              {isCenter ? "0" : `${col},${row}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-primary/70 mt-2">
                      Selected Angle: ({((selectedLed % 5) - 2) * 6.5}°, {(Math.floor(selectedLed / 5) - 2) * 6.5}°)
                    </span>
                  </div>

                  {/* Right: Simulated Fourier Domain Pupil Shift Canvas */}
                  <div className="md:col-span-7 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-widest mb-3">
                      Fourier Domain Synthetic Aperture Passband
                    </span>
                    <div className="w-full max-w-[280px] aspect-square rounded-2xl bg-slate-950 border border-white/10 relative flex items-center justify-center overflow-hidden shadow-2xl">
                      {/* Grid crosshairs */}
                      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />

                      {/* Synthetic Aperture Boundary (Outer limit) */}
                      <div className="w-56 h-56 rounded-full border border-dashed border-emerald-400/30 flex items-center justify-center relative">
                        <span className="absolute top-2 text-[9px] font-mono text-emerald-400/60 tracking-wider">
                          Synthetic NA Limit (3.2x)
                        </span>
                      </div>

                      {/* Hardware Physical Low-NA Objective Lens (Center) */}
                      <div className="w-24 h-24 rounded-full border border-white/30 bg-white/5 absolute flex items-center justify-center">
                        <span className="text-[8px] font-mono text-neutral-300/50">
                          Raw Objective (1x NA)
                        </span>
                      </div>

                      {/* Dynamic Active Shifted Sub-aperture from LED angle */}
                      {(() => {
                        const col = (selectedLed % 5) - 2;
                        const row = Math.floor(selectedLed / 5) - 2;
                        const offsetX = col * 24;
                        const offsetY = row * 24;

                        return (
                          <motion.div
                            animate={{ x: offsetX, y: offsetY }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="w-24 h-24 rounded-full border-2 border-white bg-white/20 absolute shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center pointer-events-none"
                          >
                            <span className="text-[9px] font-mono text-white font-bold">
                              Shifted k-vector
                            </span>
                          </motion.div>
                        );
                      })()}
                    </div>
                    <div className="text-center mt-3">
                      <p className="text-[11px] font-mono text-foreground/60">
                        {selectedLed === 12
                          ? "Brightfield illumination: standard spatial frequencies captured."
                          : "Darkfield tilted illumination: captures high spatial-frequency diffraction fringes otherwise lost!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Contributions / Engineering Highlights */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-primary/80 mb-3 flex items-center gap-2">
                  <Sparkles size={14} />
                  <span>Key Engineering & Scientific Contributions</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {publication.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-foreground/80 flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PublicationSection;
