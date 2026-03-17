// Site content and data
// Edit this file to update your personal information

export const siteConfig = {
  name: "Isaac Lo",
  title: "Software Engineer & Research Assistant",
  affiliation: "Georgia Institute of Technology",
  email: "ljzisaaac@gmail.com",
  location: "Atlanta, GA",
  social: {
    github: "https://github.com/iljz",
    linkedin: "https://www.linkedin.com/in/iljz/",
    // googleScholar: "#"
  }
};

export const photos = [
  { src: '/photos/mirror.png', caption: 'Chicago' },
  { src: '/photos/hike.png', caption: 'Hiking' },
  { src: '/photos/newyears.png', caption: 'New Years 2023' },
  { src: '/photos/sensorsetup.png', caption: 'Senior Design Project' },
  { src: '/photos/grad.jpg', caption: 'Graduation' },
  { src: '/photos/minasan.png', caption: 'Behind the counter' },
  { src: '/photos/panel.jpg', caption: 'Redefining the Narrative Speaker Panel' },
];

export const bio = [
  "I'm someone excited about building systems to solve real-world problems. I'm currently a completing my Master's in Computer Science at Georgia Tech, with a focus on machine learning and human-AI interaction. ",
  "I'm working as a Research Assistant at the Design Intelligence Lab where I'm building systems and exploring the application of AI in education.",
  // "One thing I truly enjoy is building community. I'm always excited to connect with people and learn from them. Feel free to reach out if you want to collaborate, chat about research, or just say hello."
];

export const projects = [
  {
    title: "PICO Scholar - AI Lit Reviews",
    description: "Built an accelerated biomedical literature review platform utilizing RAG and fine-tuned models (2nd Place at Red Hat & Intel AI Hackathon). Developed a system with LlamaIndex and FastAPI to generate multi-document summaries and context-aware chatbots for 120+ research papers, using MongoDB for chat persistence.",
    tech: ["Python", "Hugging Face", "FastAPI", "MongoDB"],
    link: "https://github.com/datagero/pico-scholar",
    year: "2025"
  },
  {
    title: "Constrained LLM Post-Training Optimization",
    description: "Optimized SFT and RL post-training for Qwen3-4B under a strict 1-GPU/24-hour budget. Utilized 4-bit quantization and LoRA to reduce memory footprint by 15%. Conducted hyperparameter ablation studies across GRPO loss variants, identifying a 1e-05 learning rate regime that swung reasoning accuracy by 14.6% to achieve a Pass@1 score of 0.8901 on the GSM8K benchmark.",
    tech: ["Python", "PyTorch", "Hugging Face"],
    link: "#",
    year: "2025"
  },
  {
    title: "Fading the Crowd: Prediction Market Visualizer",
    description: "Developed an interactive data visualization platform analyzing macroeconomic prediction markets. Engineered dynamic charts for Implied vs. Realized Probability, a microstructure heatmap, and a strategy simulator to backtest and exploit favorite-longshot biases across massive trading datasets.",
    tech: ["Python", "React", "JavaScript/TypeScript"],
    link: "#",
    year: "2026"
  },
  {
    title: "SEC 10-K Filings AI Assistant",
    description: "Engineered an AI agent designed to navigate, analyze, and retrieve targeted information from complex corporate SEC 10-K filings. Developed a reasoning layer to intelligently categorize user queries across the 15 standard 10-K items, streamlining the financial document review process.",
    tech: ["Python", "LangChain"],
    link: "#",
    year: "2025"
  }
];

export const publications = [
  {
    title: "IN PROGRESS...",
    venue: "",
    year: "2026",
    link: "#"
  }
];

export const experience = [
  {
    role: "Graduate Research Assistant",
    organization: "Georgia Institute of Technology",
    location: "Atlanta, GA",
    period: "Jan 2025 — Present",
    bullets: [
      "Designed, built, and deployed an AI Virtual TA to 800+ students across 3 universities, using a multi-modal chat agent to process course documents and deliver grounded, GPT-4-powered answers for online learning",
      "Increased retrieval relevance and answer confidence for 77% of users by implementing a multi-representation strategy in Python, querying across textual and visual data collections on a vector database",
      "Spearheaded the integration of an LTI-compliant front-end web app using TypeScript and designed a PDF viewer feature that enabled easy fact-verification and interactive reading, achieving a 97% user approval rating",
      "Architected a microservice ecosystem on AWS (EC2, S3) with 5 independently scalable services (e.g., encoding, response generation), containerized with Docker and managed via a reverse proxy"
    ]
  },
  {
    role: "Software Engineering Intern",
    organization: "Stryker",
    location: "San Jose, CA",
    period: "May 2025 - Aug 2025",
    bullets: [
      "Engineered a Java Spring Boot microservice that entirely eliminated ~30s of downtime and failovers that interrupt processes during firmware upgrades, resolving a critical reliability issue for hospital communication devices",
      "Re-architected legacy updater process by extracting it from a monolithic codebase into an independent service, decoupling server dependencies and reducing code complexity by 40%",
      "Implemented a communication layer between the legacy server and the new standalone updater, defining REST API layer and interaction logic for bi-directional communication and recovery on partial outages",
      "Designed and developed the end-to-end firmware deployment workflow, from a React-based admin client to low-latency UDP signals, enabling administrators to update 50+ hospital devices with a single click"
    ]
  },
  {
    role: "Full Stack Software Engineer",
    organization: "Aerospace Systems Design Lab - Energy Infrastructure and Data Engineering",
    location: "Remote",
    period: "Oct 2024 - May 2025",
    bullets: [
      "Developed a Vue.js/Flask dashboard to visualize real-time data from 20+ IoT sensors, enabling researchers togather insights into energy expenditures at different locations", 
      "Architected a secure sensor authentication service and Postgres data pipeline, reducing IoT data retrieval and analysis time from hours to minutes"
    ]
  },
];

export const education = [
  {
    degree: "M.S. Computer Science",
    school: "Georgia Institute of Technology - Atlanta Campus",
    period: "2024 — 2026",
    details: "Specialization in Machine Learning",
    coursework: [
      "Machine Learning",
      "Deep Reinforcement Learning",
      "Artificial Intelligence",
      "Conversation AI",
      "Data Visualization & Analytics",
      "Graduate Algorithms"
    ]
  },
  {
    degree: "B.S. Mechanical Engineering",
    school: "University of Illinois at Urbana-Champaign",
    period: "2020 — 2024",
    details: "Minor in Computer Science",
    coursework: [
      "Data Structures and Algorithms",
      "Computational Photography",
      "Biomechanical Systems",
      ""
    ]
  }
];

export const skills = {
  "Languages": [
    { name: "Python",                 proficiency: 5, years: 3, note: "Primary language for all ML, research, and backend work." },
    { name: "JavaScript/TypeScript",  proficiency: 3, years: 2, note: "Frontend UIs and full-stack services; TypeScript for LTI app at GT." },
    { name: "Java",                   proficiency: 3, years: 2, note: "Spring Boot microservices during Stryker internship." },
    { name: "C++",                    proficiency: 2, years: 2, note: "Systems programming and computational simulations." },
    { name: "SQL",                    proficiency: 2, years: 2, note: "Relational data modeling and query optimization." },
    { name: "R",                      proficiency: 1, years: 2, note: "Statistical analysis and data exploration." },
    { name: "MATLAB",                 proficiency: 1, years: 3, note: "Numerical computing and simulation during undergrad research." },
  ],
  "ML/AI": [
    { name: "PyTorch",       proficiency: 4, years: 3, note: "Deep learning training, RL experiments, and fine-tuning workflows." },
    { name: "Hugging Face",  proficiency: 4, years: 2, note: "Pre-trained model access, LoRA/SFT fine-tuning, and model evaluation." },
    { name: "scikit-learn",  proficiency: 4, years: 4, note: "Classical ML pipelines, feature engineering, and evaluation." },
    { name: "LangChain",     proficiency: 3, years: 1, note: "LLM orchestration chains and retrieval-augmented pipelines." },
    { name: "TensorFlow",    proficiency: 3, years: 2, note: "Model deployment and inference pipelines." },
  ],
  "Web & Backend": [
    { name: "React",       proficiency: 4, years: 3, note: "Admin dashboards, LTI-compliant course tools, and this portfolio." },
    { name: "FastAPI",     proficiency: 4, years: 2, note: "High-performance Python REST APIs for AI-backed services." },
    { name: "Node.js",     proficiency: 3, years: 3, note: "Server-side JS for APIs and build tooling." },
    { name: "PostgreSQL",  proficiency: 3, years: 3, note: "Relational database design for structured application data." },
    { name: "MongoDB",     proficiency: 3, years: 1, note: "Document storage for AI chat and session persistence." },
  ],
  "Tools & Infrastructure": [
    { name: "AWS",         proficiency: 4, years: 2, note: "EC2 and S3 for containerized production deployments at GT." },
    { name: "Docker",      proficiency: 4, years: 3, note: "Containerized microservices across research and internship projects." },
    { name: "Git",         proficiency: 5, years: 5, note: "Version control across every project and team collaboration." },
    { name: "Linux",       proficiency: 4, years: 4, note: "Primary development and server environment for all work." },
    { name: "Kubernetes",  proficiency: 2, years: 1, note: "Container orchestration — actively building familiarity." },
    { name: "LaTeX",       proficiency: 3, years: 3, note: "Academic writing, research papers, and formatted reports." },
  ],
};

export const navItems = ['Home', 'Resume', 'Projects', 'Publications'];

