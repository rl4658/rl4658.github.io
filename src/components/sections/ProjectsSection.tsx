import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Code, Trophy } from "lucide-react";
import { projects, awards } from "@/data/profile";

const ProjectsSection = () => {
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
    <section id="projects" ref={sectionRef} className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl md:text-4xl font-bold mb-12 text-center text-gradient"
        >
          Projects & Awards
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Projects */}
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass rounded-3xl p-6 md:p-8 hover-lift"
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Code size={20} />
                <span className="font-medium text-sm">{project.tech}</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                {project.name}
              </h3>
              <ul className="space-y-3">
                {project.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    className="flex items-start gap-3 text-foreground/80 text-sm md:text-base"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-3xl p-6 md:p-8 hover-lift"
          >
            <div className="flex items-center gap-2 text-accent mb-4">
              <Trophy size={20} />
              <span className="font-semibold">Honors & Awards</span>
            </div>
            <ul className="space-y-4">
              {awards.map((award, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{award.title}</p>
                    <p className="text-sm text-muted-foreground">{award.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
