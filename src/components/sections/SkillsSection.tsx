import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SiReact, SiPython, SiTypescript, SiAmazon, SiDocker, SiPostgresql, SiNodedotjs, SiFastapi } from "react-icons/si";
import { TechOrbit } from "@/components/animated";
import { skillCategories } from "@/data/profile";

const techIcons = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "AWS", icon: SiAmazon, color: "#FF9900" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
];

const SkillsSection = () => {
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
    <section id="skills" ref={sectionRef} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-4xl relative">
        {/* Tech Orbit - Behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] hidden lg:block pointer-events-none opacity-80" style={{ zIndex: 0 }}>
          <TechOrbit icons={techIcons} orbitRadius={{ x: 200, y: 150 }} duration={45} />
        </div>

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl md:text-4xl font-bold mb-12 text-center text-gradient"
        >
          Skills & Technologies
        </motion.h2>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 60px rgba(11, 165, 236, 0.15)",
              }}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
              className="glass rounded-3xl p-6 md:p-8"
            >
              <h3 className="font-display text-lg font-semibold mb-4 text-primary">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(11, 165, 236, 0.5)",
                      backgroundColor: "rgba(11, 165, 236, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 * categoryIndex + 0.02 * skillIndex,
                    }}
                    className="pill text-xs md:text-sm cursor-pointer"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
