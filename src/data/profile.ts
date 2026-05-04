export interface Experience {
  company: string;
  location: string;
  role: string;
  period: string;
  logoUrl: string;
  summary: string;
  skills: string[];
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
    company: "Oracle",
    location: "Redwood City, CA",
    role: "Software Engineer Intern",
    period: "Jul 2026 – Sep 2026",
    logoUrl: "/images/oracle.png",
    summary: "Incoming Software Engineer intern for the Summer of 2026.",
    skills: ["Software Engineering", "Enterprise Systems"],
  },
  {
    company: "Woyage AI",
    location: "San Francisco, CA",
    role: "Software Engineer",
    period: "July 2025 – Present",
    logoUrl: "/images/woyageai.png",
    summary: "Spearheaded the development of a highly scalable AI mock-interview platform by architecting fault-tolerant video rendering pipelines on AWS Batch and optimizing async Python LLM scoring systems.",
    skills: ["Python", "AWS Batch", "Docker", "AWS ECR", "LLMs"],
  },
  {
    company: "WisdomQ",
    location: "Palo Alto, CA",
    role: "Data & AI Engineer Intern",
    period: "Oct 2025 – Present",
    logoUrl: "/images/wisdomq.png",
    summary: "Optimized ranking engine architectures for high-throughput AI services and built scalable Supabase APIs alongside a conversational Agent interface using the Model Context Protocol.",
    skills: ["Node.js", "Supabase", "PostgreSQL", "AI Agents", "Zod"],
  },
  {
    company: "AXENTRA OS",
    location: "London, ON",
    role: "Software Engineer Intern",
    period: "Mar 2025 – Jun 2025",
    logoUrl: "/images/axentra.png",
    summary: "Developed robust Django backends with in-memory indexing and secure GraphQL clients, while integrating LangChain RAG for blazing-fast semantic search over thousands of documents.",
    skills: ["Django", "Python", "GraphQL", "REST APIs", "LangChain"],
  },
  {
    company: "Vale Base Metals",
    location: "Toronto, ON",
    role: "Data Analyst Intern",
    period: "May 2024 – Feb 2025",
    logoUrl: "/images/vale.png",
    summary: "Engineered end-to-end ETL data pipelines processing hundreds of thousands of records into SQL databases, alongside creating AI-automated Python batch-update tools to eliminate manual effort.",
    skills: ["Python", "SQL", "ETL", "Data Pipelines", "Automation"],
  },
  {
    company: "Robarts Research Institute",
    location: "London, ON",
    role: "Software Engineer Intern",
    period: "May 2023 – May 2024",
    logoUrl: "/images/robarts.png",
    summary: "Co-developed an affordable diagnostic microscope by writing C++ firmware for Raspberry Pi, and automated critical image-processing CI workflows with Python.",
    skills: ["Python", "C++", "Raspberry Pi", "Image Processing", "CI/CD"],
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
