import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { education } from "@/data/profile";

const EducationSection = () => {
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
    <section id="education" ref={sectionRef} className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl md:text-4xl font-bold mb-12 text-center text-gradient"
        >
          Education
        </motion.h2>

        {/* Education Cards */}
        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass rounded-3xl p-6 md:p-8 hover-lift"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <GraduationCap size={20} />
                    <span className="font-medium">{edu.school}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {edu.degree}
                  </h3>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={14} />
                    {edu.period}
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={14} className="text-primary" />
                    <span className="font-semibold text-primary">
                      GPA: {edu.gpa}
                    </span>
                  </div>
                </div>
              </div>

              {edu.details && (
                <ul className="space-y-2 mt-4">
                  {edu.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-start gap-3 text-foreground/80 text-sm md:text-base"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
