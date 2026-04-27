import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Trophy } from "lucide-react";
import { projects, awards } from "@/data/profile";
import { ScrollReveal } from "@/components/animated";

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-4">
      <motion.div style={{ y }} className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl md:text-4xl font-bold mb-4 text-center text-gradient"
        >
          Projects & Awards
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-foreground/60 font-mono text-sm mb-12"
        >
          {"// shipped & recognized"}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ScrollReveal
              key={project.name}
              /* Alternate direction on odd/even cards for a "weaving" effect. */
              from={index % 2 === 0 ? "left" : "right"}
              intensity={1}
            >
              <motion.div
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 60px rgba(6, 182, 212, 0.18)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-strong rounded-3xl p-6 md:p-8 h-full"
              >
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Code size={20} />
                  <span className="font-mono font-medium text-sm">{project.tech}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                  {project.name}
                </h3>
                <ul className="space-y-3">
                  {project.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-start gap-3 text-foreground/90 text-sm md:text-base"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_hsl(var(--primary))]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}

          {/* Awards card — slides from right, ends the grid */}
          <ScrollReveal
            from={projects.length % 2 === 0 ? "left" : "right"}
            intensity={1}
          >
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: "0 20px 60px rgba(16, 185, 129, 0.18)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-strong rounded-3xl p-6 md:p-8 h-full"
            >
              <div className="flex items-center gap-2 text-accent mb-4">
                <Trophy size={20} />
                <span className="font-mono font-semibold">Honors & Awards</span>
              </div>
              <ul className="space-y-4">
                {awards.map((award, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0 shadow-[0_0_10px_hsl(var(--accent))]" />
                    <div>
                      <p className="font-medium text-foreground">{award.title}</p>
                      <p className="text-sm text-foreground/60 font-mono">{award.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
