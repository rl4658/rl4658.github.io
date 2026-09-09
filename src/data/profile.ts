/* ------------------------------------------------------------------------- */
/* All portfolio content lives here. Components only read from this file.    */
/* Source of truth: RaymondLi_Resume_v7.pdf (Sep 2026) — public/resume.pdf.  */
/* ------------------------------------------------------------------------- */

export interface ImpactMetric {
  /** Display value exactly as it should read, e.g. "60%", "$100K+", "11". */
  value: string;
  label: string;
}

export interface Experience {
  /** URL-safe id used for deep links: /?exp=<slug> */
  slug: string;
  company: string;
  /** Company homepage — rendered as an outbound link on the card and detail view. */
  website: string;
  location: string;
  role: string;
  period: string;
  logoUrl: string;
  /** Technologies listed on the resume header line for this role. */
  stack: string[];
  /** One or two plain-English sentences shown on the card. */
  overview: string;
  /** Resume bullets, shown in the detail view. Numbers are animated by CountUp. */
  highlights: string[];
  /** Headline metrics shown as tiles in the detail view. */
  impact?: ImpactMetric[];
}

export interface EducationDetail {
  text: string;
  url?: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  gpa: string;
  details?: EducationDetail[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Project {
  name: string;
  tech: string;
  bullets: string[];
}

export interface Award {
  title: string;
  date: string;
  tech?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const profile = {
  name: "Raymond Li",
  tagline: "Software Engineer • AI / Distributed Systems / Full-Stack",
  region: "San Francisco Bay Area",
  citizenship: "US & Canadian citizen",
  contact: {
    phone: "925-366-1456",
    email: "ruifeng2002@gmail.com",
    linkedin: "https://www.linkedin.com/in/ruifeng-raymond-li/",
    github: "https://github.com/rl4658",
    website: "https://rl4658.github.io",
  },
  publicationUrl:
    "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/12832/1283205/Optical-resolution-and-MTF-of-a-low-cost-Fourier-ptychography/10.1117/12.3003269.short",
  about: {
    bio: "I'm a software engineer who builds AI-powered systems, distributed backends, and full-stack products. Most recently at Oracle, I worked across the full SDLC of an agentic payroll application in Oracle Fusion Cloud HCM. Before that I helped take an AI interview platform from zero to 500+ paying users at Woyage AI. I'm completing my M.S. in Software Engineering with a Cybersecurity specialization at San Jose State University.",
    highlights: [
      "Agentic Applications",
      "FastAPI",
      "React / TypeScript",
      "Oracle Fusion Cloud",
      "AWS Batch",
      "LLM Pipelines",
      "Docker",
      "PostgreSQL",
    ],
  },
};

export const experiences: Experience[] = [
  {
    slug: "oracle",
    company: "Oracle Cloud Applications",
    website: "https://www.oracle.com/applications/",
    location: "Redwood City, CA",
    role: "Software Engineer Intern",
    period: "Jun 2026 – Sep 2026",
    logoUrl: "/images/oracle.png",
    stack: ["JavaScript", "TypeScript", "XML", "Oracle SQL"],
    overview:
      "Worked within Oracle Global Payroll on a Mexico Payroll agentic application in Oracle Fusion Cloud HCM, from design through delivery, across Engineering, Product, and Payroll teams.",
    highlights: [
      "Collaborated across Engineering, Product, and Payroll teams within Oracle Global Payroll on the full SDLC for a Mexico Payroll agentic application in Oracle Fusion Cloud HCM.",
      "Architected an 11-service distributed backend in JavaScript, applying object-oriented design and complexity analysis across 3 workstreams.",
      "Built and integrated SQL-backed validation REST APIs to identify and flag employee geography and location mismatches, reducing manual review effort by 60%.",
    ],
    impact: [
      { value: "11", label: "backend services architected" },
      { value: "3", label: "parallel workstreams" },
      { value: "60%", label: "less manual review effort" },
    ],
  },
  {
    slug: "woyage-ai",
    company: "Woyage AI",
    website: "https://woyage.ai/",
    location: "San Francisco, CA",
    role: "Software Engineer",
    period: "Jul 2025 – Jan 2026",
    logoUrl: "/images/woyageai.png",
    stack: ["Python", "FastAPI", "MongoDB", "Docker", "AWS"],
    overview:
      "Drove full-stack development of an AI mock-interview platform and built the containerized video and GPU rendering infrastructure behind it on AWS.",
    highlights: [
      "Drove the full-stack development of an interview platform, launching a paid beta to 500+ users and generating $100K+ in revenue.",
      "Led containerization of a scalable Docker/AWS tech stack for video workflows, cutting deployment effort by 75%.",
      "Architected large-scale distributed GPU rendering infrastructure on AWS Batch, scaling weekly processing capacity by 50%.",
    ],
    impact: [
      { value: "500+", label: "paid beta users" },
      { value: "$100K+", label: "revenue generated" },
      { value: "75%", label: "less deployment effort" },
      { value: "50%", label: "more weekly capacity" },
    ],
  },
  {
    slug: "wisdomq",
    company: "WisdomQ",
    website: "https://wisdomq.ai/",
    location: "Palo Alto, CA",
    role: "Software Engineer Intern",
    period: "Oct 2025 – Dec 2025",
    logoUrl: "/images/wisdomq.png",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Zod"],
    overview:
      "Redesigned the ranking engine behind WisdomQ's expert discovery and built the PostgreSQL APIs that serve it at scale.",
    highlights: [
      "Redesigned the ranking engine architecture with object-oriented design principles and Node.js parallelization, reducing search latency by 55%.",
      "Developed and integrated scalable PostgreSQL APIs supporting 10K+ monthly requests with rigorous Zod validation.",
    ],
    impact: [
      { value: "55%", label: "lower search latency" },
      { value: "10K+", label: "monthly API requests" },
    ],
  },
  {
    slug: "axentra-os",
    company: "AXENTRA OS",
    website: "https://axentraos.com/",
    location: "London, ON",
    role: "Software Engineer Intern",
    period: "Mar 2025 – Jun 2025",
    logoUrl: "/images/axentra.png",
    stack: ["Python", "FastAPI", "Django", "GraphQL"],
    overview:
      "Built the data-ingestion layer, in-memory indexing, and secured REST/GraphQL APIs for a SaaS Django/FastAPI application.",
    highlights: [
      "Designed a scalable data-ingestion tech stack for a SaaS Django/FastAPI application, boosting backend efficiency by 60%.",
      "Built an optimized in-memory index using custom data structures for 5K+ records, enabling 45% faster analytics.",
      "Developed and integrated REST/GraphQL APIs with strict RBAC, shipping tools for automated token rotation.",
    ],
    impact: [
      { value: "60%", label: "backend efficiency gain" },
      { value: "5K+", label: "records indexed in memory" },
      { value: "45%", label: "faster analytics" },
    ],
  },
  {
    slug: "vale-base-metals",
    company: "Vale Base Metals",
    website: "https://www.valebasemetals.com/",
    location: "Toronto, ON",
    role: "Data Analyst Intern",
    period: "May 2024 – Feb 2025",
    logoUrl: "/images/vale.png",
    stack: ["Python", "SQL"],
    overview:
      "Engineered ETL pipelines into centralized SQL databases and automated document workflows with Python.",
    highlights: [
      "Built an ETL pipeline ingesting 500K+ records into centralized SQL databases, cutting reporting latency by 60%.",
      "Automated 1,000+ documents with an object-oriented Python batch tool, eliminating 90% of manual effort.",
    ],
    impact: [
      { value: "500K+", label: "records ingested" },
      { value: "60%", label: "lower reporting latency" },
      { value: "90%", label: "manual effort eliminated" },
    ],
  },
  {
    slug: "robarts",
    company: "Robarts Research Institute",
    website: "https://www.robarts.ca/",
    location: "London, ON",
    role: "Software Engineer Intern",
    period: "May 2023 – May 2024",
    logoUrl: "/images/robarts.png",
    stack: ["Python", "C++", "MATLAB", "Raspberry Pi"],
    overview:
      "Automated the image-processing CI pipeline and co-authored the firmware for a $10 diagnostic microscope, published in SPIE proceedings.",
    highlights: [
      "Automated a CI pipeline with 20+ modular Python scripts, improving diagnostic processing accuracy by 10%.",
      "Co-authored C++ firmware and debugged hardware integration, deploying a $10 diagnostic microscope on Raspberry Pi.",
    ],
    impact: [
      { value: "20+", label: "pipeline scripts" },
      { value: "10%", label: "better diagnostic accuracy" },
      { value: "$10", label: "microscope unit cost" },
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "SQL", "C/C++", "HTML", "CSS", "Kotlin", "C#", "Ruby", "PHP"],
  },
  {
    name: "Frameworks",
    skills: ["React.js", "React Native", "Next.js", "Angular", "Vue", "Node.js", "Express", "FastAPI", "Django", "Flask", "Tailwind"],
  },
  {
    name: "Developer Tools",
    skills: ["Git", "Linux/Ubuntu", "Bash", "Docker", "PostgreSQL", "MongoDB", "MySQL", "NoSQL", "Jira", "Confluence", "Power BI", "Visio"],
  },
  {
    name: "Cloud & Infrastructure",
    skills: ["AWS", "AWS Batch", "Google Cloud", "Microsoft Azure", "Kubernetes", "Oracle Fusion Cloud", "IoT"],
  },
];

export const education: Education[] = [
  {
    school: "San Jose State University",
    degree: "M.S. Software Engineering, Specialization in Cybersecurity",
    period: "2025 – 2027 (Expected)",
    gpa: "4.0 / 4.0",
    details: [
      {
        text: "Courses: Security Technologies, Network Security, Data Mining, Database Management, Systems Engineering, AI, ML",
      },
    ],
  },
  {
    school: "University of Western Ontario",
    degree: "B.E.Sc. Software Engineering",
    period: "2021 – 2025",
    gpa: "3.7 / 4.0",
    details: [
      {
        text: "Publication: Optical resolution and MTF of a low-cost Fourier ptychography microscope using a Raspberry Pi computer (SPIE)",
        url: profile.publicationUrl,
      },
      { text: "Dean's Honors List (2022, 2023, 2024)" },
    ],
  },
];

/* One badge link is printed on the resume; it is attached to the card rather than a single cert. */
export const certificationBadgeUrl =
  "https://catalog-education.oracle.com/ords/certview/sharebadge?id=839DF507E38BF4389393F174DF80C218B7CF35221B2A0BAFA4BAFC387DD89B72";

export const certifications: Certification[] = [
  {
    title: "Oracle Fusion AI Agent Studio Developer Professional",
    issuer: "Oracle · Rel 26-2",
    date: "Sep 2026",
  },
  {
    title: "Oracle Fusion AI Agent Studio Foundations Associate",
    issuer: "Oracle · Rel 1",
    date: "Sep 2026",
  },
];

export const projects: Project[] = [
  {
    name: "FormFixer.AI",
    tech: "React Native, Tailwind, Node.js, MongoDB",
    bullets: [
      "Shipped a real-time form-correction mobile app, reducing reported injury risk by 40% and improving gym safety",
      "Trained an open-source pose-estimation model with TensorFlow and PyTorch, boosting keypoint accuracy by 25%",
    ],
  },
];

export const awards: Award[] = [
  {
    title: "Best Use of Auth0 & Top 5 @ HackWestern 11",
    tech: "React.js, Tailwind, Flask, OpenAI API",
    date: "Dec 2024",
  },
  {
    title: "1st Place @ Toronto Tech Expo",
    tech: "React.js, Python, Flask, OpenAI & Spotify API",
    date: "Mar 2024",
  },
  {
    title: "2nd Place @ Western Engineering Competition",
    tech: "Python",
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
