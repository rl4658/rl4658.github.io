import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { publication } from "@/data/profile";

export default function PublicationSection() {
  return (
    <section id="publication" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="editorial-eyebrow mb-6">Selected publication / 2024</p>
        <div className="editorial-card grid md:grid-cols-2 overflow-hidden">
          <div className="flex items-center justify-center p-6 md:p-10 relative overflow-hidden bg-neutral-900/30 border-b md:border-b-0 md:border-r border-white/10 min-h-[320px] md:min-h-full">
            <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-3xl absolute pointer-events-none" />
            <img
              src="/images/publication/fig1_prototype_dark.png"
              alt="Prototype of the Raspberry Pi Fourier ptychography microscope"
              loading="lazy"
              className="relative z-10 w-full max-w-lg h-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
            />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center items-start">
            <span className="editorial-eyebrow">SPIE BiOS · Computational microscopy</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight leading-tight">
              How far can a low-cost microscope see?
            </h2>
            <p className="mt-5 text-neutral-400 leading-7">
              A Raspberry Pi, a programmable LED array, and an optical question. Our paper measures what Fourier ptychography can recover from hardware costing less than $200.
            </p>
            <p className="mt-4 text-xs text-neutral-500 leading-6">{publication.title}</p>
            <Link
              to="/publication"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-neutral-200"
            >
              Read the research story <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
