import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
          whileHover={{
            y: -8,
            boxShadow: "0 20px 60px rgba(11, 165, 236, 0.15)",
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          {/* Section Title */}
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-gradient">
            About Me
          </h2>

          {/* Bio */}
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
            {profile.about.bio}
          </p>

          {/* Highlight Chips */}
          <div className="flex flex-wrap gap-3">
            {profile.about.highlights.map((highlight, index) => (
              <motion.span
                key={highlight}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="pill bg-primary/10 text-primary border-primary/20"
              >
                {highlight}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
