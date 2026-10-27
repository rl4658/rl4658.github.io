/* ------------------------------------------------------------------------- */
/* All portfolio content lives here. Components only read from this file.    */
/* Source of truth: RaymondLi_Resume_v7.pdf & GitHub repositories           */
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

export interface ProjectArchitecture {
  summary: string;
  flow: string[];
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  stack: string[];
  category:
    | "AI & Computer Vision"
    | "Full-Stack & APIs"
    | "Algorithms & Data"
    | "Systems & Networking"
    | "Game Engine & Systems"
    | "Systems & Algorithms"
    | "Computer Graphics & Shaders"
    | "Security & AI Systems"
    | string;
  tagline: string;
  githubUrl: string;
  demoUrl?: string;
  youtubeId?: string;  stars?: number;
  overview: string;
  bullets: string[];
  metrics?: { label: string; value: string }[];
  architecture?: ProjectArchitecture;
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

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  date: string;
  doi?: string;
  url: string;
  abstract: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  bibtex: string;
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
      "FastAPI & Django",
      "React / TypeScript",
      "Oracle Fusion Cloud",
      "AWS Batch & Docker",
      "Computer Vision & Pose Estimation",
      "Multi-threaded C++ Sockets",
      "PostgreSQL & MongoDB",
    ],
  },
};

export const publication: Publication = {
  title: "Optical Resolution and MTF of a Low-Cost Fourier Ptychography Microscope using a Raspberry Pi Computer",
  authors: ["Haechan J. Yang", "William Wasswa", "Raymond Li", "Brandon Pautler", "Aiden Fry", "Rajan Leung", "David W. Holdsworth", "Ian A. Cunningham"],
  venue: "Optics and Biophotonics in Low-Resource Settings X · SPIE BiOS",
  date: "2024",
  doi: "10.1117/12.3003269",
  url: "https://doi.org/10.1117/12.3003269",
  abstract: "An affordable microscope is only useful if its imaging performance can be measured. This work evaluates a Raspberry Pi Fourier ptychography microscope built from components costing less than $200. A 196-LED array illuminates a specimen from different angles; Python reconstruction combines the resulting images. Resolution is assessed through the modulation transfer function (MTF), using least-squares fits to profiles of a 1951 USAF bar target. The on-axis image reaches 10% MTF at 300 cycles/mm, compared with a theoretical pupil limit of 280 cycles/mm. Reconstruction extends the 10% MTF frequency to 550 cycles/mm, about 1.8 times the on-axis result and near the sampling limit of 670 cycles/mm. The study offers a practical way to evaluate inexpensive computational microscopes being developed for point-of-care malaria diagnosis.",
  highlights: [
    "Co-author on the SPIE paper evaluating the optical performance of a low-cost Fourier ptychography microscope.",
    "Contributed modular Python imaging pipelines and C++ firmware during research at Robarts Research Institute.",
    "Worked on Raspberry Pi hardware integration and debugging alongside the imaging research team.",
  ],
  metrics: [
    { label: "Component cost", value: "<$200" },
    { label: "10% MTF", value: "550 cycles/mm" },
    { label: "Resolution gain", value: "1.8×" },
  ],
  bibtex: `@inproceedings{yang2024optical,
  title={Optical resolution and MTF of a low-cost Fourier ptychography microscope using a Raspberry Pi computer},
  author={Yang, Haechan J. and Wasswa, William and Li, Raymond and Pautler, Brandon and Fry, Aiden and Leung, Rajan and Holdsworth, David W. and Cunningham, Ian A.},
  booktitle={Optics and Biophotonics in Low-Resource Settings X},
  volume={12832},
  pages={1283205},
  year={2024},
  publisher={SPIE},
  doi={10.1117/12.3003269}
}`,
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
      "Collaborated across Engineering, Product, and Payroll teams within Oracle Global Payroll on the full SDLC for a Mexico Payroll agentic application in Oracle Fusion Cloud HCM.",
    highlights: [
      "Collaborated across Engineering, Product, and Payroll teams within Oracle Global Payroll on the full SDLC for a Mexico Payroll agentic application in Oracle Fusion Cloud HCM.",
      "Architected an 11-service distributed backend in JavaScript, applying OOD and complexity analysis across 3 workstreams.",
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
      "Drove full-stack development of an interview platform, launching a paid beta to 500+ users and generating $100K+.",
    highlights: [
      "Drove the full-stack development of an interview platform, launching a paid beta to 500+ users and generating $100K+.",
      "Led containerization of a scalable Docker/AWS tech stack for video workflows, cutting deployment effort by 75%.",
      "Architected large-scale distributed GPU rendering infra on AWS Batch, scaling weekly processing capacity by 50%.",
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
      "Redesigned the ranking engine architecture with OOD principles and Node.js parallelization, reducing search latency by 55%.",
    highlights: [
      "Redesigned ranking engine architecture with OOD principles and Node.js parallelization, reducing search latency by 55%.",
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
      "Designed a scalable data-ingestion tech stack for a SaaS Django/FastAPI application, boosting backend efficiency by 60%.",
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
      "Built an ETL pipeline ingesting 500K+ records into centralized SQL databases, cutting reporting latency by 60%.",
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
      "Automated a CI pipeline with 20+ modular Python scripts, improving diagnostic processing accuracy by 10%.",
    highlights: [
      "Automated a CI pipeline with 20+ modular Python scripts, improving diagnostic processing accuracy by 10%.",
      "Co-authored C++ firmware and debugged hardware integration, integrating a Raspberry Pi diagnostic microscope with component costs below $200.",
    ],
    impact: [
      { value: "20+", label: "pipeline scripts" },
      { value: "10%", label: "better diagnostic accuracy" },
      { value: "<$200", label: "microscope component cost" },
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
    skills: ["Angular", "React Native", "React.js", "Node.js", "Express", "Next", "Vue", "Django", "Flask", "Tailwind"],
  },
  {
    name: "Developer Tools",
    skills: ["Git", "Linux/Ubuntu", "Bash", "MongoDB", "MySQL", "NoSQL", "Docker", "Jira", "Confluence", "Power BI", "Visio"],
  },
  {
    name: "Cloud & Infrastructure",
    skills: ["AWS", "Google Cloud", "Microsoft Azure", "Kubernetes", "Cloud Computing", "IoT", "Oracle Fusion Cloud"],
  },
];

export const education: Education[] = [
  {
    school: "San Jose State University",
    degree: "Master of Science in Software Engineering, Specialization in Cybersecurity",
    period: "2025 – 2027 Expected",
    gpa: "4.0 / 4.0",
    details: [
      {
        text: "Courses: Security Technologies, Network Security, Data Mining, Database Management, Systems Engineering, AI, ML",
      },
    ],
  },
  {
    school: "University of Western Ontario",
    degree: "Bachelor of Engineering Science in Software Engineering",
    period: "2021 – 2025",
    gpa: "3.7 / 4.0",
    details: [
      {
        text: "Publication: Optical resolution and MTF of a low-cost Fourier ptychography microscope using a Raspberry Pi computer",
        url: profile.publicationUrl,
      },
      { text: "Awards: Dean's Honors List 2022, 2023, 2024" },
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
    date: "September 2026",
  },
  {
    title: "Oracle Fusion AI Agent Studio Foundations Associate",
    issuer: "Oracle · Rel 1",
    date: "September 2026",
  },
];

export const projects: Project[] = [
  {
    id: "crypto-misuse-detector",
    name: "Cryptographic Misuse Detector",
    tech: "Python, Google Gemini API, Semgrep, FastAPI, SSE, AST Analysis",
    stack: [
      "Python 3.10+",
      "Google Gemini 2.0/2.5 Flash (google-genai)",
      "Semgrep (AST Engine)",
      "FastAPI & Uvicorn",
      "Server-Sent Events (SSE)",
      "GitPython",
      "Rich Terminal UI",
      "PyCryptodome",
      "Pytest",
    ],
    category: "Security & AI Systems",
    tagline: "Dual-engine static analysis platform combining Gemini LLM and Semgrep rules to detect cryptographic implementation flaws across Python, Java, and Go",
    githubUrl: "https://github.com/rl4658/cryptographic-misuse-detector",
    overview:
      "Cryptographic Misuse Detector (CryptoScan) is a dual-engine security static analysis platform that pairs rule-based AST pattern matching (Semgrep) with large language model semantic reasoning (Google Gemini 2.0/2.5 Flash via google-genai) to detect OWASP Top 10 A02:2021 cryptographic flaws across Python, Java, and Go codebases. Engineered with a multi-language rule pipeline, chunked LLM static analysis with temperature=0 deterministic reasoning and strict JSON schema generation, a ground-truth benchmark comparator computing Precision, Recall, and F1 (±5 line tolerance), and an asynchronous FastAPI backend streaming real-time pipeline events via Server-Sent Events (SSE) to a retro cyberpunk CRT terminal interface.",
    bullets: [
      "Constructed dual-engine parallel static analysis pipeline combining deterministic AST pattern matching (Semgrep) with semantic LLM inference (Google Gemini Flash).",
      "Authored custom multi-language YAML Semgrep rules detecting 6 OWASP/CWE cryptographic flaws (hardcoded keys CWE-321, ECB mode CWE-327, weak hash algorithms CWE-327, IV reuse CWE-329, insecure PRNG CWE-338, insufficient key length CWE-326) across Python, Java, and Go.",
      "Engineered chunked semantic static analysis in Python using google-genai SDK with 150-line windowing, system instruction guardrails, temperature=0.0 determinism, and Pydantic structured JSON schemas.",
      "Built comparative evaluation engine benchmarking Semgrep vs. LLM findings against curated ground-truth datasets, calculating True Positives, False Positives, False Negatives, Precision, Recall, and F1 score with ±5 line tolerance.",
      "Architected asynchronous FastAPI backend utilizing Server-Sent Events (SSE) for real-time progress, finding emission, and agreement metric streaming paired with GitPython shallow repository sandboxing.",
    ],
    metrics: [
      { label: "Vulnerability Types", value: "6 CWE Classes" },
      { label: "Languages", value: "Python, Java, Go" },
      { label: "Engine Arch", value: "Dual (Semgrep + LLM)" },
      { label: "Streaming Protocol", value: "FastAPI SSE" },
    ],
    architecture: {
      summary: "Target Git Repository / File -> Shallow Sandbox Clone -> Dual Engine Dispatch [Semgrep AST Rules || Gemini 2.5 Flash LLM 150-line Chunks] -> Finding Normalization -> Ground-Truth Comparator (±5 line tolerance) -> Rich CLI / FastAPI SSE Stream.",
      flow: [
        "1. Ingestion: Shallow clones repository via GitPython into an isolated tempdir sandbox with safe URL validation",
        "2. AST Engine: Semgrep invokes language-specific YAML rule manifests (python_crypto.yaml, java_crypto.yaml, go_crypto.yaml)",
        "3. Semantic LLM Engine: Divides source files into 150-line overlapping windows, invoking Gemini Flash with temperature=0.0 and Pydantic JSON schemas",
        "4. Finding Normalization: Standardizes heterogeneous tool outputs into unified CryptoFinding models (rule_id, cwe, severity, line, code_snippet, fix)",
        "5. Ground-Truth Comparator: Matches tool findings against ground_truth.json using ±5 line matching window, calculating TP, FP, FN, Precision, Recall, and F1",
        "6. Telemetry & Streaming: Dispatches live progress, finding payloads, and agreement metrics via Rich terminal tables or FastAPI Server-Sent Events (SSE)",
      ],
    },
  },
  {
    id: "form-fixer",
    name: "FormFixer.AI",
    tech: "React Native, Expo, VisionCamera, Skia, TFLite, Node.js, Express, MongoDB",
    stack: [
      "React Native (Expo 52)",
      "VisionCamera v4",
      "Shopify Skia",
      "TensorFlow Lite (poseModel.tflite)",
      "Node.js & Express",
      "MongoDB Atlas",
      "JWT & Bcrypt",
      "Biomechanical Kinematics",
    ],
    category: "AI & Computer Vision",
    tagline: "Real-time AI biomechanical pose correction & gym injury prevention on edge mobile devices",
    githubUrl: "https://github.com/rl4658/form-fixer",
    demoUrl: "https://www.youtube.com/watch?v=JZ4HPtc7ChY&ab_channel=TheBestofAI",
    youtubeId: "JZ4HPtc7ChY",
    overview:
      "FormFixer.AI is a full-stack AI fitness platform built with React Native (Expo) and Node.js/Express. It runs on-device TensorFlow Lite pose estimation via VisionCamera and Shopify Skia, extracting 33 skeletal landmarks at 30+ FPS and applying the Law of Cosines to calculate joint angles in real time for exercises like Barbell Squat, Bench Press, and Deadlift.",
    bullets: [
      "Built native mobile video pipeline using VisionCamera v4 and vision-camera-resize-plugin to feed 720p frames to fast-tflite models.",
      "Engineered real-time geometric joint angle calculation using the Law of Cosines across shoulder-elbow-wrist and hip-knee-ankle keypoints at 30+ FPS.",
      "Rendered high-performance skeletal landmarks and bone connections using Shopify React Native Skia frame processors with zero frame drop.",
      "Architected Node.js Express backend with JWT authentication, Bcrypt password hashing, Nodemailer verification, and MongoDB Atlas database persistence.",
    ],
    metrics: [
      { label: "Injury Risk Reduction", value: "-40%" },
      { label: "Keypoint Accuracy Boost", value: "+25%" },
      { label: "On-Device Latency", value: "<28ms" },
      { label: "Tracked Exercises", value: "6 Types" },
    ],
    architecture: {
      summary: "React Native VisionCamera Frame Processor -> VisionCamera Resize Plugin -> Fast-TFLite poseModel.tflite -> Shopify Skia Skeletal Overlay -> Law of Cosines Angle Solver -> Node.js/Express MongoDB Sync.",
      flow: [
        "1. Video Capture: React Native VisionCamera v4 grabs real-time frames at 30 FPS",
        "2. Frame Resize: vision-camera-resize-plugin scales frame to TFLite model input tensors",
        "3. TFLite Pose Inference: Fast-TFLite runs poseModel.tflite on CoreML/GPU delegate to extract 33 skeletal keypoints",
        "4. Law of Cosines Solver: Computes angle = acos((d1² + d2² - d3²) / (2*d1*d2)) * 180 / π for joint flexion verification",
        "5. Skia Render Pass: Draws high-contrast skeletal lines and joint circles directly onto video frames in worklet thread",
        "6. Cloud Service: Node.js/Express REST API with JWT security and MongoDB Atlas for user form progression logging",
      ],
    },
  },
  {
    id: "spotify-playlist-generator",
    name: "Spotify Playlist Generator",
    tech: "Python, FastAPI, React, OpenAI API, Spotify API",
    stack: ["React", "FastAPI", "Python", "OpenAI API", "Spotify Web API", "Tailwind CSS"],
    category: "Full-Stack & APIs",
    tagline: "AI natural language prompt to personalized Spotify playlist generator with acoustic feature tuning",
    githubUrl: "https://github.com/rl4658/spotify-playlist-generator",
    overview:
      "A React + FastAPI application that leverages OpenAI and the Spotify API to craft personalized playlists from user prompts and fine-tuned audio feature sliders (danceability, energy, acousticness, valence, and tempo).",
    bullets: [
      "Designed full-stack architecture linking React frontend to asynchronous FastAPI backend for instant playlist synthesis.",
      "Integrated OpenAI GPT models to translate descriptive mood prompts into musical parameter vectors and query seeds.",
      "Leveraged Spotify Web API OAuth2 PKCE flow for seamless user authentication and direct playlist export.",
      "Built multi-slider audio characteristic tuning interface allowing precise control over tempo, valence, and energy curves.",
    ],
    metrics: [
      { label: "Audio Sliders", value: "5 Features" },
      { label: "Generation Speed", value: "<1.2s" },
      { label: "API Integration", value: "OAuth2 PKCE" },
      { label: "Award", value: "1st Place Winner" },
    ],
    architecture: {
      summary: "User Prompt & Sliders -> FastAPI Gateway -> OpenAI Prompt Embedding -> Spotify Audio Features Recommendation Engine -> Exported Playlist.",
      flow: [
        "1. Input: Natural language query + fine-grained audio sliders (Dance, Energy, Valence)",
        "2. NLP Parsing: OpenAI extracts artist seeds, genre boundaries, and sentiment",
        "3. Spotify API: Queries audio-features endpoints matching target target_danceability/energy",
        "4. Export: Asynchronously creates and syncs playlist directly to user's Spotify account",
      ],
    },
  },
  {
    id: "sorting-hub",
    name: "Sorting Hub",
    tech: "Java, JavaFX, Scene Builder, FXML",
    stack: [
      "Java 17",
      "JavaFX 17",
      "FXML & Scene Builder",
      "Multi-Threading (Concurrency)",
      "Strategy Pattern",
      "Algorithms & Data Structures",
    ],
    category: "Systems & Algorithms",
    tagline: "Multi-threaded JavaFX desktop sorting visualizer engineered with the Strategy Pattern and decoupled UI animation pipelines",
    githubUrl: "https://github.com/rl4658/sorting-hub",
    overview:
      "A graphical sorting algorithm demonstration developed in JavaFX and Scene Builder for Western University Software Design (SE 2203). Visualizes in-place Merge Sort and Selection Sort across dynamically scalable arrays (32 to 128 elements). Features a decoupled multi-threaded architecture using background worker threads and Platform.runLater() to guarantee zero UI thread lock during intensive sorting operations.",
    bullets: [
      "Architected clean Object-Oriented Strategy Pattern (SortingStrategy extending Runnable) enabling polymorphic algorithm swapping via SortingHubController.",
      "Engineered multi-threaded JavaFX concurrency separating heavy computational sorting loops onto dedicated worker threads to eliminate UI freezing.",
      "Dispatched real-time graphical mutations back to the JavaFX Application Thread using Platform.runLater() synchronized with dynamic millisecond throttling.",
      "Implemented in-place Merge Sort (O(N log N)) with recursive pointer-shifting and Selection Sort (O(N²)) with dynamic array generation via LinkedHashSet.",
    ],
    metrics: [
      { label: "Array Scaling", value: "32–128" },
      { label: "UI Thread Lock", value: "0 ms" },
      { label: "Design Pattern", value: "Strategy Pattern" },
      { label: "Thread Safety", value: "Platform.runLater" },
    ],
    architecture: {
      summary: "JavaFX Stage -> Scene Builder FXML View -> SortingHubController -> Worker Thread -> SortingStrategy (MergeSort / SelectionSort) -> Platform.runLater Canvas Redraws.",
      flow: [
        "1. FXML View Initialization: Loads 800x400 stage with Western University logo, ComboBox algorithm selector, and array size slider (32–128, default 64)",
        "2. Unsorted Array Generation: LinkedHashSet creates random integer permutations from 1 to N to guarantee unique bar heights",
        "3. Strategy Pattern Binding: Controller binds SortingStrategy dynamically to either SelectionSort or MergeSort instances",
        "4. Concurrency Decoupling: Controller spawns a dedicated Thread to execute the sorting loop, preventing UI thread starvation",
        "5. UI Synchronization: Background thread invokes Platform.runLater(() -> controller.updateGraph(numbers)) with throttled sleep delays",
        "6. Proportional Canvas Layout: Dynamically computes rectangle widths and heights across the 768x329 Pane with gap adjustments",
      ],
    },
  },
  {
    id: "enginerea",
    name: "Bobby: The Town of Enginerea",
    tech: "Python, Pygame, OOP, Game Physics",
    stack: [
      "Python 3.10",
      "Pygame",
      "Object-Oriented Design",
      "AABB Collision Detection",
      "Sprite Kinematics & AI",
      "Game Loop Architecture",
    ],
    category: "Game Engine & Systems",
    tagline: "2D action platformer game engine featuring projectile kinematics, homing enemy AI, AABB collision, and modular shop loadout systems",
    githubUrl: "https://github.com/rl4658/enginerea",
    overview:
      "An action-adventure 2D platformer engineered in Python and Pygame following the story of Bobby the Builder rebuilding the ruined town hall of Enginerea. Features a 150 FPS game loop, AABB collision detection across moving platforms, homing projectile physics, interactive shop upgrades, and boss battles across 3 levels.",
    bullets: [
      "Engineered high-performance 150 FPS Pygame loop managing game states, sprite animations, and modal shop pauses.",
      "Implemented custom AABB collision system handling multi-axis platform adhesion, gravity curves, and hazard respawning.",
      "Developed dual projectile mechanics: rotational player axe throws that can deflect incoming bullets, and homing enemy attacks.",
      "Architected modular shop system allowing real-time stat upgrades and dynamic sprite loadout synthesis (shields and axes).",
    ],
    metrics: [
      { label: "Campaign Levels", value: "3 Stages" },
      { label: "Framerate", value: "150 FPS" },
      { label: "Physics Model", value: "AABB + Kinematics" },
      { label: "Match Tracking", value: "End-Game Stats" },
    ],
    architecture: {
      summary: "Pygame Event Pump -> Character Kinematics & AABB Collisions -> Enemy AI & Homing Projectiles -> Sprite State Sync -> Render Pipeline.",
      flow: [
        "1. Main Event Loop: Polls pygame.event.get() for input (Arrow keys, Spacebar attack, 'P' shop pause) at 150 FPS",
        "2. Kinematics & Collision: Applies gravity (jumpingSpeed delta) and resolves horizontal/vertical collisions with moving platforms",
        "3. Combat & Projectiles: Spawns rotational axe bullets and calculates homing vectors for enemy projectiles targeting Bobby",
        "4. In-Game Shop: Pauses game loop to render upgrade UI, dynamically modifying player combat attributes and sprite sheets",
        "5. Level Progression: Tracks enemy clearances to unlock level transition doors leading to the final Town Hall boss encounter",
        "6. Telemetry & Scoring: Records match duration, damage taken, axes chucked, and coins earned for victory/death screens",
      ],
    },
  },
  {
    id: "chatroom-whisperers",
    name: "Chatroom Whisperers",
    tech: "C++, POSIX Sockets, Multi-threading, Python, PyQt5",
    stack: [
      "Python (PyQt5 GUI)",
      "C++11",
      "POSIX Sockets",
      "Multi-threading",
      "Mutex Synchronization",
      "Network Protocols",
    ],
    category: "Systems & Networking",
    tagline: "Multi-threaded POSIX C++ socket server and PyQt5 GUI desktop chatroom client with password-protected rooms",
    githubUrl: "https://github.com/rl4658/chatroom-whisperers",
    overview:
      "A full-stack networked desktop application featuring a multi-threaded C++ socket server (127.0.0.1:3000) and a Python PyQt5 desktop GUI client. Concurrently manages dynamic chatrooms with capacity constraints, password protection, real-time message broadcasting, and thread-safe state synchronization with POSIX mutex locks.",
    bullets: [
      "Built high-concurrency C++ TCP server with dedicated worker threads (SocketThreadIndividually) per client connection.",
      "Designed robust semicolon-delimited ASCII protocol (CREATE_ROOM, JOIN_ROOM, MESSAGE_ROOM, DISCONNECT_ROOM, UPDATE_DATA).",
      "Enforced thread synchronization via std::mutex (roomsMutex, roomDataMutex, connectedClientsMutex) and std::lock_guard.",
      "Engineered desktop PyQt5 GUI featuring dynamic lobby, room creation slider (2-5 users), locked-room password verification, and instant room messaging.",
    ],
    metrics: [
      { label: "Server Arch", value: "C++11 / POSIX Sockets" },
      { label: "Client Arch", value: "Python 3 / PyQt5" },
      { label: "Protocol", value: "TCP :3000 (ASCII)" },
      { label: "Synchronization", value: "std::mutex Locks" },
    ],
    architecture: {
      summary: "SocketServer (Port 3000) -> ServerThread Accept Loop -> SocketThreadIndividually per Client -> Mutex-Guarded Room Data -> PyQt5 Desktop Client.",
      flow: [
        "1. Server Startup: ServerThread binds socket to 127.0.0.1:3000 and listens for TCP client handshakes",
        "2. Client Connection: PyQt5 client connects, triggering worker thread spawn with dedicated socket FD",
        "3. Semicolon Protocol Parsing: Worker processes CREATE_ROOM, JOIN_ROOM, MESSAGE_ROOM with lock_guard synchronization",
        "4. State Broadcast & Teardown: Broadcasts UPDATE_DATA to all connected peers; cleans up on DISCONNECT_ROOM or client exit",
      ],
    },
  },
  {
    id: "water-surface-simulation",
    name: "Water Surface Simulation",
    tech: "C++11, OpenGL 4.0, GLSL, GLFW, GLEW, GLM",
    stack: [
      "C++11",
      "OpenGL 4.0 Core",
      "GLSL Shaders",
      "Hardware Tessellation (TCS/TES)",
      "Geometry Shaders",
      "GLFW & GLEW",
      "GLM Mathematics",
      "Procedural Wave Physics",
    ],
    category: "Computer Graphics & Shaders",
    tagline: "Real-time procedural ocean water simulation with hardware tessellation (TCS/TES), 4-wave Gerstner displacement, and heightmap blending",
    githubUrl: "https://github.com/rl4658/water_shader",
    overview:
      "A real-time procedural ocean water rendering engine built in modern C++11, OpenGL 4.0 Core Profile, and GLSL. Implements a multi-stage programmable GPU graphics pipeline utilizing Quad-Patch Hardware Tessellation (Tessellation Control and Evaluation Shaders) for dynamic level-of-detail surface subdivision, Geometry Shader 4-wave Gerstner trochoidal displacement and dynamic normal generation via vector cross products, heightmap texture blending, and animated Phong specular illumination.",
    bullets: [
      "Constructed an OpenGL 4.0 5-stage programmable rendering pipeline spanning Vertex Shader, TCS, TES, Geometry Shader, and Fragment Shader with custom GLSL shaders.",
      "Implemented Quad-Patch hardware tessellation (layout (vertices = 4) out) in TCS and bilinear coordinate interpolation in TES, dynamically subdividing low-resolution coarse base meshes.",
      "Engineered multi-frequency Gerstner trochoidal wave physics in the Geometry Shader combining 4 wave harmonic vectors with steepness (Q factor) parameterization.",
      "Blended procedural trochoidal mathematics with high-frequency heightmap texture displacement (displacement-map1.bmp) and temporal UV velocity offsets.",
      "Calculated analytical dynamic surface normal vectors across displaced triangle primitives using cross(b - a, c - b), driving realistic Blinn-Phong specular ocean highlights.",
      "Architected modular C++11 systems featuring PlaneMesh procedural quad grid generation, Camera spherical orbit controls, and GLFW event dispatching.",
    ],
    metrics: [
      { label: "Shader Stages", value: "5 GLSL Stages" },
      { label: "Tessellation", value: "64x Quad Patch" },
      { label: "Gerstner Waves", value: "4 Harmonic Waves" },
      { label: "Framerate", value: "60+ FPS" },
    ],
    architecture: {
      summary: "PlaneMesh Quad Grid -> Vertex Transform -> TCS Quad Patch Tesselator -> TES Bilinear Interpolation -> Geometry Shader Gerstner & Heightmap Displacement -> Fragment Shader Phong Shading.",
      flow: [
        "1. PlaneMesh Base Geometry: C++ generates coarse 20x20 world space quad grid (GL_PATCHES with 4 control points per primitive)",
        "2. Vertex Shader: Computes world space coordinates, light vector, eye vector, and animated scrolling UV coordinates (posXZ + texOffset + time * 0.08) / texScale",
        "3. Tessellation Control Shader (TCS): Sets per-patch gl_TessLevelOuter and gl_TessLevelInner dynamically, delegating work to GPU hardware tessellator",
        "4. Tessellation Evaluation Shader (TES): Bilinearly interpolates vertex position, light vector, eye vector, and UVs across (u, v) normalized patch coordinates",
        "5. Geometry Shader: Evaluates 4-component Gerstner trochoidal equations + heightmap red channel sampling, displacing vertices and computing cross-product surface normals",
        "6. Fragment Shader: Normalizes perturbed surface normals and evaluates Phong illumination (ambient, diffuse water texture, specular highlight with pow(cosAlpha, 8.0))",
      ],
    },
  },
];

export const awards: Award[] = [
  {
    title: "Best Use of Auth0 & Top 5 @ HackWestern11",
    tech: "React.js, Tailwind, Flask, OpenAI API",
    date: "December 2024",
  },
  {
    title: "1st Place @ Toronto Tech Expo",
    tech: "React.js, Python, Flask, OpenAI & Spotify API",
    date: "March 2024",
  },
  {
    title: "2nd Place @ Western Engineering Competition",
    tech: "Python",
    date: "January 2024",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Publication", href: "/publication", isRoute: true },
  { label: "Projects", href: "/projects", isRoute: true },
  { label: "Hobbies", href: "/hobbies", isRoute: true },
];
