import { motion } from "framer-motion";
import { MapPin, Download, ChevronDown } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";
import { CodeParticles, SkillsDonut } from "@/components/animated";
import { profile } from "@/data/profile";

interface HeroSectionProps {
  onResumeClick: () => void;
}

const HeroSection = ({ onResumeClick }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Hero Content */}
          <div className="text-center lg:text-left">
        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 pill mb-8"
        >
          <MapPin size={14} className="text-primary" />
          <span className="text-sm text-foreground/70">{profile.region}</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="text-gradient">{profile.name}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 font-light"
        >
          {profile.tagline}
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center lg:justify-start gap-4 mb-10"
        >
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 glass rounded-2xl hover-lift transition-all"
            aria-label="GitHub"
          >
            <SiGithub size={24} />
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 glass rounded-2xl hover-lift transition-all"
            aria-label="LinkedIn"
          >
            <SiLinkedin size={24} />
          </a>
          <a
            href={`mailto:${profile.contact.email}`}
            className="p-4 glass rounded-2xl hover-lift transition-all"
            aria-label="Email"
          >
            <HiOutlineMail size={24} />
          </a>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
        >
          <button
            onClick={onResumeClick}
            className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover-lift flex items-center gap-2"
          >
            <Download size={20} />
            View Resume
          </button>
          <a
            href="#about"
            className="px-8 py-4 rounded-2xl glass font-semibold hover-lift transition-all"
          >
            Learn More
          </a>
        </motion.div>
          </div>

          {/* RIGHT: 3D Donut */}
          <div className="hidden lg:block h-[700px] w-[700px] relative">
            <SkillsDonut rotationSpeed={0.003} />
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 glass rounded-full"
        >
          <ChevronDown size={24} className="text-muted-foreground" />
        </motion.div>
      </motion.div>

      {/* Code Particles */}
      <CodeParticles count={6} area="hero" colorScheme="mixed" />
    </section>
  );
};

export default HeroSection;
