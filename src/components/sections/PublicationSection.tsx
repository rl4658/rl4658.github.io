import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { publication } from "@/data/profile";

export default function PublicationSection() {
  return <section id="publication" className="py-20 md:py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <p className="editorial-eyebrow mb-6">Selected publication / 2024</p>
      <div className="editorial-card grid md:grid-cols-2 overflow-hidden">
        <figure className="bg-white flex items-center p-6 md:p-10"><img src="/images/publication/fig1_prototype.png" alt="Prototype of the Raspberry Pi Fourier ptychography microscope" loading="lazy" className="w-full h-auto max-h-[440px] object-contain" /></figure>
        <div className="p-8 md:p-12 flex flex-col justify-center items-start">
          <span className="editorial-eyebrow">SPIE BiOS · Computational microscopy</span>
          <h2 className="mt-5 text-3xl md:text-4xl font-light tracking-tight leading-tight">How far can a low-cost microscope see?</h2>
          <p className="mt-5 text-neutral-400 leading-7">A Raspberry Pi, a programmable LED array, and an optical question. Our paper measures what Fourier ptychography can recover from hardware costing less than $200.</p>
          <p className="mt-4 text-xs text-neutral-500 leading-6">{publication.title}</p>
          <Link to="/publication" className="mt-8 inline-flex items-center gap-3 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-neutral-200">Read the research story <ArrowUpRight size={17} /></Link>
        </div>
      </div>
    </div>
  </section>;
}
