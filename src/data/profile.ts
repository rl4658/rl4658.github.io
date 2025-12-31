export interface Experience {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  gpa: string;
  details?: string[];
}

export interface Project {
  name: string;
  tech: string;
  bullets: string[];
}

export interface Award {
  title: string;
  date: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const profile = {
  name: "Raymond Li",
  tagline: "Software Engineer • AI / Data / Full-Stack",
  region: "San Francisco Bay Area",
  contact: {
    phone: "925-366-1456",
    email: "ruifeng2002@gmail.com",
    linkedin: "https://www.linkedin.com/in/ruifeng-raymond-li/",
    github: "https://github.com/rl4658",
    website: "https://rl4658.github.io",
  },
  about: {
    bio: "I'm a Software Engineer with a passion for building scalable AI-powered systems, data pipelines, and full-stack applications. Currently pursuing my M.S. in Software Engineering with a Cybersecurity focus at SJSU, I blend practical industry experience with cutting-edge research.",
    highlights: [
      "FastAPI",
      "React/TypeScript",
      "AWS",
      "LLM Pipelines",
      "GPU Batch Rendering",
      "Docker",
      "PostgreSQL",
    ],
  },
};

export const experiences: Experience[] = [
  {
    company: "Woyage AI",
    location: "San Francisco, CA",
    role: "Software Engineer",
    period: "July 2025 – Present",
    bullets: [
      "Built AI mock-interview platform (team of 5); launched paid beta to 500+ users generating $100K+ in month 1",
      "Containerized video workflows into Docker + AWS ECR pipelines; reduced deployment effort by 75%",
      "Fault-tolerant video services w/ automated health checks; decreased production failure by 90%",
      "Optimized LLM scoring pipelines via fine-tuning + async Python I/O; hours→minutes (65% throughput increase)",
      "Architected scalable GPU rendering infra on AWS Batch; increased weekly capacity by 50%",
    ],
  },
  {
    company: "WisdomQ",
    location: "Palo Alto, CA",
    role: "Data & AI Engineer Intern",
    period: "Oct 2025 – Present",
    bullets: [
      "Optimized ranking engine architecture; reduced latency by 55% and doubled throughput via Node.js parallelization + prompt optimizations",
      "Automated onboarding parsing LinkedIn data; cut manual entry by 70% for 100+ users",
      "Built Supabase/PostgreSQL APIs for 10K+ monthly requests; strict Zod validation",
      "Built AI Agent interface using Model Context Protocol for 100+ beta users to browse/book services in chat",
    ],
  },
  {
    company: "AXENTRA OS",
    location: "London, ON",
    role: "Software Engineer Intern",
    period: "Mar 2025 – Jun 2025",
    bullets: [
      "Integrated AI transcription as Django ingestion layer; boosted backend efficiency by 60%",
      "In-memory index for 5K+ transcripts; sub-second lookups and 45% faster analytics",
      "Secure REST/GraphQL clients w/ RBAC; internal dev-tools for token rotation",
      "Semantic search over 10K+ docs with LangChain RAG; cut query latency by 50%",
    ],
  },
  {
    company: "Vale Base Metals",
    location: "Toronto, ON",
    role: "Data Analyst Intern",
    period: "May 2024 – Feb 2025",
    bullets: [
      "End-to-end ETL ingesting 500K+ records into SQL; cut reporting latency by 60%",
      "Python batch-update tool for 1,000+ documents; eliminated 90% manual effort via AI automations",
    ],
  },
  {
    company: "Robarts Research Institute",
    location: "London, ON",
    role: "Software Engineer Intern",
    period: "May 2023 – May 2024",
    bullets: [
      "Automated image-processing CI with 20+ Python scripts; improved diagnostic accuracy by 10%",
      "Co-developed $10 diagnostic microscope; co-authored C++ firmware on Raspberry Pi",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Python", "JavaScript", "Java", "TypeScript", "HTML", "CSS", "SQL", "C/C++", "Kotlin", "C#", "Ruby", "PHP"],
  },
  {
    name: "Frameworks",
    skills: ["React", "React Native", "Next.js", "Vue", "Angular", "Node.js", "Express", "Django", "Flask", "FastAPI"],
  },
  {
    name: "Tools",
    skills: ["Git", "Linux/Ubuntu", "Bash", "MongoDB", "MySQL", "PostgreSQL", "Docker", "Jira", "Confluence", "Power BI"],
  },
  {
    name: "Cloud & Infra",
    skills: ["AWS", "Google Cloud", "Microsoft Azure", "Kubernetes", "IoT", "ECR", "Batch"],
  },
];

export const education: Education[] = [
  {
    school: "San Jose State University",
    degree: "M.S. Software Engineering (Cybersecurity)",
    period: "2025 – 2027 (Expected)",
    gpa: "4.0",
    details: [
      "Security Technologies, Network Security, Data Mining, Database Management, Systems Engineering, AI, ML",
    ],
  },
  {
    school: "University of Western Ontario",
    degree: "B.E.Sc. Software Engineering",
    period: "2021 – 2025",
    gpa: "3.7",
    details: [
      "Publication: Optical resolution and MTF of a low-cost Fourier ptychography microscope using a Raspberry Pi computer",
      "Dean's Honors List (2022, 2023, 2024)",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "FormFixer.AI",
    tech: "React Native, Tailwind, Node, MongoDB",
    bullets: [
      "Real-time form-correction mobile app; reduced reported injury risk by 40%",
      "Trained open-source pose-estimation model (TensorFlow/PyTorch); boosted keypoint accuracy by 25%",
    ],
  },
];

export const awards: Award[] = [
  {
    title: "Best Use of Auth0 & Top 5 @ HackWestern11",
    date: "Dec 2024",
  },
  {
    title: "1st Place @ Toronto Tech Expo",
    date: "Mar 2024",
  },
  {
    title: "2nd Place @ Western Engineering Competition",
    date: "Jan 2024",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
];
