import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Download, ChevronDown } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";
import { CodeParticles, SkillsDonut } from "@/components/animated";
import { profile } from "@/data/profile";

interface HeroSectionProps {
  onResumeClick: () => void;
}

// Magnetic Icon Component
const MagneticIcon = ({ children, href, label }: { children: React.ReactNode; href: string; label: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? "_blank" : undefined}
      rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
      className="p-4 glass rounded-2xl transition-all"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.a>
  );
};

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

        {/* Name - Character-by-character reveal */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight text-gradient">
          {profile.name.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

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
          <MagneticIcon href={profile.contact.github} label="GitHub">
            <SiGithub size={24} />
          </MagneticIcon>
          <MagneticIcon href={profile.contact.linkedin} label="LinkedIn">
            <SiLinkedin size={24} />
          </MagneticIcon>
          <MagneticIcon href={`mailto:${profile.contact.email}`} label="Email">
            <HiOutlineMail size={24} />
          </MagneticIcon>
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
            className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover-lift flex items-center gap-2 btn-shimmer"
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
