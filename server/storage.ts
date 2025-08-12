import { type Course, type Tutorial, type UserProgress, type Quiz, type Exam, type Certificate, type InsertCourse, type InsertTutorial, type InsertUserProgress, type InsertQuiz, type InsertExam, type InsertCertificate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Tutorials
  getTutorials(): Promise<Tutorial[]>;
  getTutorialsByCategory(category: string): Promise<Tutorial[]>;
  getTutorialsByCourse(courseId: string): Promise<Tutorial[]>;
  getTutorial(id: string): Promise<Tutorial | undefined>;
  getTutorialBySlug(slug: string): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  
  // Quizzes
  getQuizzes(): Promise<Quiz[]>;
  getQuizzesByCourse(courseId: string): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Exams
  getExams(): Promise<Exam[]>;
  getExamsByCourse(courseId: string): Promise<Exam[]>;
  getExam(id: string): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;

  // Certificates
  getCertificates(): Promise<Certificate[]>;
  getUserCertificates(userId: string): Promise<Certificate[]>;
  getCertificate(id: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private courses: Map<string, Course> = new Map();
  private tutorials: Map<string, Tutorial> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private exams: Map<string, Exam> = new Map();
  private certificates: Map<string, Certificate> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed courses for 50+ programming languages organized by category
    const courseData = [
      // Frontend Development
      { id: "html", title: "HTML", description: "HyperText Markup Language - The foundation of web pages", icon: "fab fa-html5", category: "frontend", color: "#E34F26", order: 1 },
      { id: "css", title: "CSS", description: "Cascading Style Sheets - Styling for web pages", icon: "fab fa-css3-alt", category: "frontend", color: "#1572B6", order: 2 },
      { id: "javascript", title: "JavaScript", description: "Dynamic programming language for web development", icon: "fab fa-js-square", category: "frontend", color: "#F7DF1E", order: 3 },
      { id: "typescript", title: "TypeScript", description: "JavaScript with static type definitions", icon: "fas fa-code", category: "frontend", color: "#3178C6", order: 4 },
      { id: "react", title: "React", description: "A JavaScript library for building user interfaces", icon: "fab fa-react", category: "frontend", color: "#61DAFB", order: 5 },
      { id: "vue", title: "Vue.js", description: "Progressive JavaScript framework", icon: "fab fa-vuejs", category: "frontend", color: "#4FC08D", order: 6 },
      { id: "angular", title: "Angular", description: "Platform for building web applications", icon: "fab fa-angular", category: "frontend", color: "#DD0031", order: 7 },
      { id: "svelte", title: "Svelte", description: "Compile-time optimized framework", icon: "fas fa-bolt", category: "frontend", color: "#FF3E00", order: 8 },
      { id: "sass", title: "Sass", description: "CSS extension language", icon: "fab fa-sass", category: "frontend", color: "#CF649A", order: 9 },
      
      // Backend Development
      { id: "python", title: "Python", description: "Versatile programming language for backend development", icon: "fab fa-python", category: "backend", color: "#3776AB", order: 10 },
      { id: "java", title: "Java", description: "Object-oriented programming language", icon: "fab fa-java", category: "backend", color: "#ED8B00", order: 11 },
      { id: "csharp", title: "C#", description: "Modern object-oriented programming language", icon: "fas fa-hashtag", category: "backend", color: "#239120", order: 12 },
      { id: "nodejs", title: "Node.js", description: "JavaScript runtime for server-side development", icon: "fab fa-node-js", category: "backend", color: "#339933", order: 13 },
      { id: "php", title: "PHP", description: "Server-side scripting language", icon: "fab fa-php", category: "backend", color: "#777BB4", order: 14 },
      { id: "ruby", title: "Ruby", description: "Dynamic programming language focused on simplicity", icon: "fas fa-gem", category: "backend", color: "#CC342D", order: 15 },
      { id: "go", title: "Go", description: "Fast, statically typed compiled language", icon: "fas fa-forward", category: "backend", color: "#00ADD8", order: 16 },
      { id: "rust", title: "Rust", description: "Systems programming language focused on safety", icon: "fas fa-cog", category: "backend", color: "#000000", order: 17 },
      { id: "kotlin", title: "Kotlin", description: "Modern programming language for JVM", icon: "fas fa-code", category: "backend", color: "#7F52FF", order: 18 },
      { id: "scala", title: "Scala", description: "Functional and object-oriented programming", icon: "fas fa-stairs", category: "backend", color: "#DC322F", order: 19 },
      { id: "clojure", title: "Clojure", description: "Dynamic functional programming language", icon: "fas fa-parentheses", category: "backend", color: "#5881D8", order: 20 },
      { id: "elixir", title: "Elixir", description: "Dynamic functional language for maintainable applications", icon: "fas fa-flask", category: "backend", color: "#4B275F", order: 21 },
      { id: "erlang", title: "Erlang", description: "Concurrent functional programming language", icon: "fas fa-network-wired", category: "backend", color: "#A90533", order: 22 },
      
      // Systems Programming
      { id: "c", title: "C", description: "Low-level programming language", icon: "fas fa-copyright", category: "systems", color: "#A8B9CC", order: 23 },
      { id: "cpp", title: "C++", description: "Object-oriented extension of C", icon: "fas fa-plus", category: "systems", color: "#00599C", order: 24 },
      { id: "assembly", title: "Assembly", description: "Low-level assembly language programming", icon: "fas fa-microchip", category: "systems", color: "#654321", order: 25 },
      { id: "d", title: "D", description: "Systems programming language", icon: "fas fa-d", category: "systems", color: "#B03931", order: 26 },
      { id: "nim", title: "Nim", description: "Efficient and expressive systems language", icon: "fas fa-crown", category: "systems", color: "#FFE953", order: 27 },
      { id: "zig", title: "Zig", description: "General-purpose programming language", icon: "fas fa-lightning-bolt", category: "systems", color: "#EC915C", order: 28 },
      
      // Mobile Development  
      { id: "swift", title: "Swift", description: "Programming language for iOS development", icon: "fab fa-swift", category: "mobile", color: "#FA7343", order: 29 },
      { id: "dart", title: "Dart", description: "Programming language optimized for client development", icon: "fas fa-dart-board", category: "mobile", color: "#0175C2", order: 30 },
      { id: "flutter", title: "Flutter", description: "UI toolkit for building mobile applications", icon: "fas fa-mobile-alt", category: "mobile", color: "#02569B", order: 31 },
      { id: "react-native", title: "React Native", description: "Framework for building native mobile apps", icon: "fab fa-react", category: "mobile", color: "#61DAFB", order: 32 },
      { id: "ionic", title: "Ionic", description: "Cross-platform mobile app development", icon: "fas fa-bolt", category: "mobile", color: "#3880FF", order: 33 },
      
      // Database Languages
      { id: "sql", title: "SQL", description: "Structured Query Language for databases", icon: "fas fa-database", category: "database", color: "#336791", order: 34 },
      { id: "nosql", title: "NoSQL", description: "Non-relational database technologies", icon: "fas fa-leaf", category: "database", color: "#4DB33D", order: 35 },
      { id: "graphql", title: "GraphQL", description: "Query language for APIs", icon: "fas fa-project-diagram", category: "database", color: "#E10098", order: 36 },
      
      // Data Science & AI
      { id: "r", title: "R", description: "Statistical computing and graphics", icon: "fas fa-chart-line", category: "data-science", color: "#276DC3", order: 37 },
      { id: "matlab", title: "MATLAB", description: "Multi-paradigm numerical computing environment", icon: "fas fa-calculator", category: "data-science", color: "#0076A8", order: 38 },
      { id: "julia", title: "Julia", description: "High-performance language for technical computing", icon: "fas fa-atom", category: "data-science", color: "#9558B2", order: 39 },
      { id: "octave", title: "Octave", description: "Scientific programming language", icon: "fas fa-wave-square", category: "data-science", color: "#0790C0", order: 40 },
      
      // Scripting Languages
      { id: "bash", title: "Bash", description: "Unix shell and command language", icon: "fas fa-terminal", category: "scripting", color: "#4EAA25", order: 41 },
      { id: "powershell", title: "PowerShell", description: "Task automation and configuration management", icon: "fas fa-power-off", category: "scripting", color: "#5391FE", order: 42 },
      { id: "perl", title: "Perl", description: "High-level programming language", icon: "fas fa-code", category: "scripting", color: "#39457E", order: 43 },
      { id: "lua", title: "Lua", description: "Lightweight scripting language", icon: "fas fa-moon", category: "scripting", color: "#2C2D72", order: 44 },
      
      // Functional Programming
      { id: "haskell", title: "Haskell", description: "Purely functional programming language", icon: "fas fa-lambda", category: "functional", color: "#5D4F85", order: 45 },
      { id: "lisp", title: "Lisp", description: "Family of programming languages", icon: "fas fa-list-ul", category: "functional", color: "#9F1D20", order: 46 },
      { id: "scheme", title: "Scheme", description: "Dialect of the Lisp programming language", icon: "fas fa-sitemap", category: "functional", color: "#1E4AE9", order: 47 },
      { id: "fsharp", title: "F#", description: "Functional programming language", icon: "fas fa-f", category: "functional", color: "#378BBA", order: 48 },
      { id: "ocaml", title: "OCaml", description: "General-purpose programming language", icon: "fas fa-camel", category: "functional", color: "#EC6813", order: 49 },
      
      // Specialized Languages
      { id: "solidity", title: "Solidity", description: "Contract-oriented programming language", icon: "fas fa-coins", category: "blockchain", color: "#363636", order: 50 },
      { id: "vhdl", title: "VHDL", description: "Hardware description language", icon: "fas fa-microchip", category: "hardware", color: "#543978", order: 51 },
      { id: "verilog", title: "Verilog", description: "Hardware description and verification language", icon: "fas fa-circuit-board", category: "hardware", color: "#B83998", order: 52 },
      
      // PROFESSIONAL CERTIFICATION COURSES
      // Cybersecurity Certification Track
      { 
        id: "cybersecurity-fundamentals", title: "Cybersecurity Fundamentals", 
        description: "Complete cybersecurity certification covering network security, ethical hacking, and incident response", 
        icon: "fas fa-shield-alt", category: "cybersecurity", color: "#DC143C", order: 53,
        certificateAvailable: true, examRequired: true, duration: "12 weeks", level: "professional"
      },
      { 
        id: "ethical-hacking", title: "Certified Ethical Hacker (CEH)", 
        description: "Professional ethical hacking and penetration testing certification", 
        icon: "fas fa-bug", category: "cybersecurity", color: "#8B0000", order: 54,
        certificateAvailable: true, examRequired: true, duration: "8 weeks", level: "advanced"
      },
      { 
        id: "network-security", title: "Network Security Specialist", 
        description: "Advanced network security protocols, firewalls, and intrusion detection", 
        icon: "fas fa-network-wired", category: "cybersecurity", color: "#B22222", order: 55,
        certificateAvailable: true, examRequired: true, duration: "10 weeks", level: "professional"
      },

      // Cloud Computing Certification Track  
      {
        id: "aws-solutions-architect", title: "AWS Solutions Architect", 
        description: "Professional AWS cloud architecture and deployment certification", 
        icon: "fab fa-aws", category: "cloud", color: "#FF9900", order: 56,
        certificateAvailable: true, examRequired: true, duration: "10 weeks", level: "professional"
      },
      {
        id: "azure-fundamentals", title: "Microsoft Azure Fundamentals", 
        description: "Complete Azure cloud computing certification program", 
        icon: "fas fa-cloud", category: "cloud", color: "#0078D4", order: 57,
        certificateAvailable: true, examRequired: true, duration: "8 weeks", level: "intermediate"
      },
      {
        id: "google-cloud-architect", title: "Google Cloud Professional Architect", 
        description: "GCP cloud architecture and infrastructure design certification", 
        icon: "fab fa-google", category: "cloud", color: "#4285F4", order: 58,
        certificateAvailable: true, examRequired: true, duration: "12 weeks", level: "professional"
      },
      {
        id: "kubernetes-admin", title: "Certified Kubernetes Administrator", 
        description: "Container orchestration and Kubernetes cluster management", 
        icon: "fas fa-dharmachakra", category: "cloud", color: "#326CE5", order: 59,
        certificateAvailable: true, examRequired: true, duration: "6 weeks", level: "advanced"
      },

      // Networking Professional Track
      {
        id: "cisco-ccna", title: "Cisco CCNA Certification", 
        description: "Comprehensive networking fundamentals and Cisco certification prep", 
        icon: "fas fa-sitemap", category: "networking", color: "#1BA0D7", order: 60,
        certificateAvailable: true, examRequired: true, duration: "16 weeks", level: "professional"
      },
      {
        id: "network-plus", title: "CompTIA Network+", 
        description: "Industry-standard networking certification covering protocols and troubleshooting", 
        icon: "fas fa-ethernet", category: "networking", color: "#E6522C", order: 61,
        certificateAvailable: true, examRequired: true, duration: "12 weeks", level: "intermediate"
      },
      {
        id: "wireless-networking", title: "Wireless Network Specialist", 
        description: "Advanced WiFi, 5G, and wireless network technologies", 
        icon: "fas fa-wifi", category: "networking", color: "#32CD32", order: 62,
        certificateAvailable: true, examRequired: true, duration: "8 weeks", level: "advanced"
      },

      // Digital Marketing Professional Track
      {
        id: "digital-marketing-mastery", title: "Digital Marketing Professional", 
        description: "Complete digital marketing certification: SEO, PPC, social media, and analytics", 
        icon: "fas fa-chart-line", category: "marketing", color: "#FF6B35", order: 63,
        certificateAvailable: true, examRequired: true, duration: "10 weeks", level: "professional"
      },
      {
        id: "google-ads-certified", title: "Google Ads Certification", 
        description: "Official Google Ads certification for PPC advertising mastery", 
        icon: "fab fa-google", category: "marketing", color: "#34A853", order: 64,
        certificateAvailable: true, examRequired: true, duration: "6 weeks", level: "intermediate"
      },
      {
        id: "social-media-marketing", title: "Social Media Marketing Expert", 
        description: "Professional social media strategy, content creation, and campaign management", 
        icon: "fas fa-share-alt", category: "marketing", color: "#E1306C", order: 65,
        certificateAvailable: true, examRequired: true, duration: "8 weeks", level: "intermediate"
      },
      {
        id: "seo-specialist", title: "SEO Specialist Certification", 
        description: "Advanced SEO techniques, keyword research, and search engine optimization", 
        icon: "fas fa-search", category: "marketing", color: "#4285F4", order: 66,
        certificateAvailable: true, examRequired: true, duration: "8 weeks", level: "advanced"
      },

      // AI & Machine Learning Professional Track
      {
        id: "machine-learning-engineer", title: "Machine Learning Engineer", 
        description: "Professional ML engineering: algorithms, model deployment, and production systems", 
        icon: "fas fa-brain", category: "ai-ml", color: "#FF6F00", order: 67,
        certificateAvailable: true, examRequired: true, duration: "14 weeks", level: "professional"
      },
      {
        id: "deep-learning-specialist", title: "Deep Learning Specialist", 
        description: "Neural networks, TensorFlow, PyTorch, and advanced deep learning applications", 
        icon: "fas fa-project-diagram", category: "ai-ml", color: "#9C27B0", order: 68,
        certificateAvailable: true, examRequired: true, duration: "12 weeks", level: "advanced"
      },
      {
        id: "ai-prompt-engineering", title: "AI Prompt Engineering Professional", 
        description: "Advanced prompt engineering for GPT, Claude, and large language models", 
        icon: "fas fa-robot", category: "ai-ml", color: "#00BCD4", order: 69,
        certificateAvailable: true, examRequired: true, duration: "6 weeks", level: "intermediate"
      },
      {
        id: "computer-vision", title: "Computer Vision Engineer", 
        description: "Image processing, object detection, and computer vision applications", 
        icon: "fas fa-eye", category: "ai-ml", color: "#795548", order: 70,
        certificateAvailable: true, examRequired: true, duration: "10 weeks", level: "advanced"
      },

      // IoT & Robotics Professional Track
      {
        id: "iot-fundamentals", title: "IoT Systems Engineer", 
        description: "Internet of Things architecture, sensors, protocols, and edge computing", 
        icon: "fas fa-microchip", category: "iot-robotics", color: "#607D8B", order: 71,
        certificateAvailable: true, examRequired: true, duration: "10 weeks", level: "intermediate"
      },
      {
        id: "robotics-engineer", title: "Robotics Engineering Professional", 
        description: "Robot programming, control systems, sensors, and autonomous systems", 
        icon: "fas fa-robot", category: "iot-robotics", color: "#9E9E9E", order: 72,
        certificateAvailable: true, examRequired: true, duration: "16 weeks", level: "professional"
      },
      {
        id: "embedded-systems", title: "Embedded Systems Developer", 
        description: "Microcontrollers, real-time systems, and embedded software development", 
        icon: "fas fa-memory", category: "iot-robotics", color: "#FF5722", order: 73,
        certificateAvailable: true, examRequired: true, duration: "12 weeks", level: "advanced"
      },
      {
        id: "arduino-raspberry-pi", title: "Arduino & Raspberry Pi Specialist", 
        description: "Hands-on electronics prototyping and IoT device development", 
        icon: "fas fa-tools", category: "iot-robotics", color: "#00878F", order: 74,
        certificateAvailable: true, examRequired: true, duration: "8 weeks", level: "beginner"
      }
    ];

    courseData.forEach(course => {
      this.courses.set(course.id, course);
    });

    // Comprehensive professional certification quizzes and exams
    const certificationAssessments = [
      // Cybersecurity Quiz
      {
        id: "cybersecurity-fundamentals-quiz",
        courseId: "cybersecurity-fundamentals",
        tutorialId: "cybersecurity-intro",
        title: "Cybersecurity Fundamentals Assessment",
        questions: JSON.stringify([
          {
            id: "q1",
            question: "What does the CIA triad stand for in cybersecurity?",
            options: ["Confidentiality, Integrity, Availability", "Central Intelligence Agency", "Computer, Internet, Applications", "Cyber, Information, Assurance"],
            correctAnswer: 0,
            explanation: "The CIA triad represents the three core principles of information security."
          },
          {
            id: "q2",
            question: "Which framework is commonly used for cybersecurity risk management?",
            options: ["OWASP", "NIST Cybersecurity Framework", "ISO 9001", "GDPR"],
            correctAnswer: 1,
            explanation: "NIST Cybersecurity Framework is widely adopted for managing cybersecurity risks."
          }
        ]),
        passingScore: 80,
        timeLimit: 15,
        order: 1,
      },
      
      // AWS Certification Exam
      {
        id: "aws-solutions-architect-exam",
        courseId: "aws-solutions-architect",
        title: "AWS Solutions Architect Professional Exam",
        description: "Comprehensive exam testing AWS services, architecture patterns, and cloud best practices.",
        questions: JSON.stringify([
          {
            id: "e1",
            question: "You need to design a highly available web application. Which AWS services would you combine?",
            options: ["EC2 with Elastic IP", "Auto Scaling Group + Application Load Balancer + CloudFront", "Lambda + API Gateway only", "Single EC2 instance"],
            correctAnswer: 1,
            explanation: "Auto Scaling Group with ALB and CloudFront provides high availability and scalability."
          },
          {
            id: "e2",
            question: "What is the most cost-effective storage for infrequently accessed data?",
            options: ["S3 Standard", "S3 Glacier Instant Retrieval", "S3 Standard-IA", "S3 Glacier Deep Archive"],
            correctAnswer: 2,
            explanation: "S3 Standard-IA is designed for infrequent access with rapid retrieval needs."
          }
        ]),
        passingScore: 85,
        timeLimit: 90,
        certificateTemplate: "aws-professional"
      },

      // Machine Learning Quiz
      {
        id: "ml-engineer-assessment",
        courseId: "machine-learning-engineer", 
        tutorialId: "ml-engineer-intro",
        title: "ML Engineering Professional Assessment",
        questions: JSON.stringify([
          {
            id: "ml1",
            question: "What is the primary purpose of MLOps?",
            options: ["To replace data scientists", "To operationalize ML models in production", "To create better algorithms", "To reduce processing time"],
            correctAnswer: 1,
            explanation: "MLOps focuses on operationalizing ML models for reliable production deployment."
          },
          {
            id: "ml2", 
            question: "Which technique helps prevent overfitting?",
            options: ["Adding more features", "Cross-validation", "Increasing complexity", "Using smaller datasets"],
            correctAnswer: 1,
            explanation: "Cross-validation provides robust evaluation and helps prevent overfitting."
          }
        ]),
        passingScore: 75,
        timeLimit: 20,
        order: 1
      }
    ];

    // Add assessments to storage
    certificationAssessments.forEach(assessment => {
      if (assessment.description) {
        this.exams.set(assessment.id, assessment as Exam);
      } else {
        this.quizzes.set(assessment.id, assessment as Quiz);
      }
    });

    // Comprehensive tutorials for all 50+ programming languages
    const tutorialData = [
      // HTML Tutorials (Beginner to Advanced)
      {
        id: "html-basics", courseId: "html", title: "HTML Basics", slug: "html-basics",
        content: `<h2>HTML Fundamentals</h2><p>HTML (HyperText Markup Language) is the foundation of web development. Learn the basic structure and essential elements.</p><h3>Document Structure</h3><ul><li>DOCTYPE declaration</li><li>HTML element</li><li>Head and body sections</li><li>Essential meta tags</li></ul>`,
        codeExample: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome to HTML!</h1>\n    <p>This is your first HTML page.</p>\n</body>\n</html>`,
        language: "html", difficulty: "beginner", readTime: 10, order: 1, nextTutorial: "html-forms", prevTutorial: null
      },
      {
        id: "html-forms", courseId: "html", title: "HTML Forms", slug: "html-forms",
        content: `<h2>Creating Interactive Forms</h2><p>Forms are essential for user interaction. Learn to create forms with various input types and validation.</p><h3>Form Elements</h3><ul><li>Input fields</li><li>Select dropdowns</li><li>Textareas</li><li>Buttons and validation</li></ul>`,
        codeExample: `<form action="/submit" method="POST">\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" required>\n  \n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <label for="age">Age:</label>\n  <select id="age" name="age">\n    <option value="18-25">18-25</option>\n    <option value="26-35">26-35</option>\n  </select>\n  \n  <button type="submit">Submit</button>\n</form>`,
        language: "html", difficulty: "intermediate", readTime: 15, order: 2, nextTutorial: "html-semantic", prevTutorial: "html-basics"
      },
      {
        id: "html-semantic", courseId: "html", title: "Semantic HTML", slug: "html-semantic",
        content: `<h2>Semantic HTML Elements</h2><p>Use semantic elements for better accessibility and SEO. Structure your content meaningfully.</p><h3>Semantic Elements</h3><ul><li>header, nav, main, aside</li><li>article, section</li><li>figure, figcaption</li><li>time, address</li></ul>`,
        codeExample: `<header>\n  <nav>\n    <ul>\n      <li><a href="#home">Home</a></li>\n      <li><a href="#about">About</a></li>\n    </ul>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h1>Article Title</h1>\n    <time datetime="2024-01-01">January 1, 2024</time>\n    <p>Article content goes here...</p>\n  </article>\n  \n  <aside>\n    <h2>Related Links</h2>\n    <ul>\n      <li><a href="#link1">Link 1</a></li>\n    </ul>\n  </aside>\n</main>`,
        language: "html", difficulty: "advanced", readTime: 20, order: 3, nextTutorial: "css-basics", prevTutorial: "html-forms"
      },

      // CSS Tutorials (Beginner to Advanced)
      {
        id: "css-basics", courseId: "css", title: "CSS Fundamentals", slug: "css-fundamentals",
        content: `<h2>CSS Basics</h2><p>Cascading Style Sheets control the visual presentation of HTML elements. Master selectors, properties, and values.</p><h3>Core Concepts</h3><ul><li>Selectors and specificity</li><li>Box model</li><li>Colors and typography</li><li>Layout basics</li></ul>`,
        codeExample: `/* Basic selectors */\nh1 {\n  color: #2563eb;\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\n#unique-element {\n  background-color: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n}\n\n/* Pseudo-classes */\na:hover {\n  color: #dc2626;\n  text-decoration: underline;\n}`,
        language: "css", difficulty: "beginner", readTime: 12, order: 1, nextTutorial: "css-flexbox", prevTutorial: "html-semantic"
      },
      {
        id: "css-flexbox", courseId: "css", title: "CSS Flexbox", slug: "css-flexbox",
        content: `<h2>Flexbox Layout</h2><p>Flexbox provides efficient layout control for one-dimensional layouts. Master flexible and responsive designs.</p><h3>Flexbox Properties</h3><ul><li>display: flex</li><li>justify-content, align-items</li><li>flex-direction, flex-wrap</li><li>flex-grow, flex-shrink</li></ul>`,
        codeExample: `.flex-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}\n\n.flex-item {\n  flex: 1;\n  padding: 1rem;\n  background-color: #f1f5f9;\n  border-radius: 4px;\n}\n\n.flex-item:first-child {\n  flex: 2; /* Takes up twice the space */\n}\n\n.vertical-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}`,
        language: "css", difficulty: "intermediate", readTime: 18, order: 2, nextTutorial: "css-grid", prevTutorial: "css-basics"
      },
      {
        id: "css-grid", courseId: "css", title: "CSS Grid", slug: "css-grid",
        content: `<h2>CSS Grid Layout</h2><p>Grid enables powerful two-dimensional layouts. Create complex responsive designs with ease.</p><h3>Grid Properties</h3><ul><li>grid-template-columns/rows</li><li>grid-gap</li><li>grid-area placement</li><li>Responsive grid techniques</li></ul>`,
        codeExample: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  grid-gap: 2rem;\n  padding: 2rem;\n}\n\n.grid-item {\n  background-color: #e2e8f0;\n  padding: 1.5rem;\n  border-radius: 8px;\n}\n\n/* Complex grid layout */\n.layout-grid {\n  display: grid;\n  grid-template-areas:\n    "header header header"\n    "sidebar main main"\n    "footer footer footer";\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}`,
        language: "css", difficulty: "advanced", readTime: 25, order: 3, nextTutorial: "javascript-basics", prevTutorial: "css-flexbox"
      },

      // JavaScript Tutorials (Beginner to Fullstack)
      {
        id: "javascript-basics", courseId: "javascript", title: "JavaScript Fundamentals", slug: "javascript-fundamentals",
        content: `<h2>JavaScript Essentials</h2><p>JavaScript brings interactivity to web pages. Learn variables, data types, functions, and control structures.</p><h3>Core Concepts</h3><ul><li>Variables and data types</li><li>Functions and scope</li><li>Conditionals and loops</li><li>Arrays and objects</li></ul>`,
        codeExample: `// Variables and data types\nconst name = "John";\nlet age = 25;\nvar city = "New York"; // Avoid var in modern JS\n\n// Functions\nfunction greet(person) {\n  return \`Hello, \${person}!\`;\n}\n\n// Arrow functions\nconst add = (a, b) => a + b;\n\n// Objects and arrays\nconst user = {\n  name: "Alice",\n  age: 30,\n  hobbies: ["reading", "coding", "gaming"]\n};\n\n// Destructuring\nconst { name: userName, age: userAge } = user;\nconsole.log(userName, userAge);`,
        language: "javascript", difficulty: "beginner", readTime: 15, order: 1, nextTutorial: "javascript-dom", prevTutorial: "css-grid"
      },
      {
        id: "javascript-dom", courseId: "javascript", title: "DOM Manipulation", slug: "javascript-dom-manipulation",
        content: `<h2>Working with the DOM</h2><p>The Document Object Model allows JavaScript to interact with HTML elements. Learn to manipulate content dynamically.</p><h3>DOM Methods</h3><ul><li>Selecting elements</li><li>Modifying content and attributes</li><li>Event handling</li><li>Creating and removing elements</li></ul>`,
        codeExample: `// Selecting elements\nconst button = document.getElementById('myButton');\nconst items = document.querySelectorAll('.item');\n\n// Event handling\nbutton.addEventListener('click', function(event) {\n  console.log('Button clicked!');\n  event.preventDefault();\n});\n\n// Modifying content\nconst title = document.querySelector('h1');\ntitle.textContent = 'New Title';\ntitle.style.color = 'blue';\n\n// Creating elements\nconst newDiv = document.createElement('div');\nnewDiv.className = 'dynamic-content';\nnewDiv.innerHTML = '<p>Dynamically added!</p>';\ndocument.body.appendChild(newDiv);`,
        language: "javascript", difficulty: "intermediate", readTime: 20, order: 2, nextTutorial: "javascript-async", prevTutorial: "javascript-basics"
      },
      {
        id: "javascript-async", courseId: "javascript", title: "Async JavaScript", slug: "javascript-async-programming",
        content: `<h2>Asynchronous Programming</h2><p>Handle asynchronous operations with callbacks, promises, and async/await. Essential for modern JavaScript development.</p><h3>Async Concepts</h3><ul><li>Callbacks and callback hell</li><li>Promises and promise chaining</li><li>Async/await syntax</li><li>Error handling</li></ul>`,
        codeExample: `// Promises\nfunction fetchUser(id) {\n  return fetch(\`/api/users/\${id}\`)\n    .then(response => response.json())\n    .catch(error => console.error('Error:', error));\n}\n\n// Async/await\nasync function getUserData(id) {\n  try {\n    const response = await fetch(\`/api/users/\${id}\`);\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error('Error fetching user:', error);\n    throw error;\n  }\n}\n\n// Using the async function\ngetUserData(123)\n  .then(user => console.log(user))\n  .catch(err => console.log('Failed to get user'));`,
        language: "javascript", difficulty: "advanced", readTime: 25, order: 3, nextTutorial: "typescript-basics", prevTutorial: "javascript-dom"
      },

      // Continue with more languages...
      // TypeScript
      {
        id: "typescript-basics", courseId: "typescript", title: "TypeScript Introduction", slug: "typescript-introduction",
        content: `<h2>TypeScript Fundamentals</h2><p>TypeScript adds static type checking to JavaScript. Write more reliable and maintainable code.</p><h3>Key Features</h3><ul><li>Static typing</li><li>Interfaces and types</li><li>Classes and inheritance</li><li>Generics</li></ul>`,
        codeExample: `// Basic types\nlet name: string = "John";\nlet age: number = 25;\nlet isActive: boolean = true;\n\n// Interfaces\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // Optional property\n}\n\n// Functions with types\nfunction greetUser(user: User): string {\n  return \`Hello, \${user.name}!\`;\n}\n\n// Generics\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\nconst result = identity<string>("Hello TypeScript");`,
        language: "typescript", difficulty: "intermediate", readTime: 18, order: 1, nextTutorial: "react-basics", prevTutorial: "javascript-async"
      },

      // React
      {
        id: "react-basics", courseId: "react", title: "React Fundamentals", slug: "react-fundamentals",
        content: `<h2>React Components and JSX</h2><p>React is a library for building user interfaces with components. Learn JSX, props, state, and component lifecycle.</p><h3>Core Concepts</h3><ul><li>Components and JSX</li><li>Props and state</li><li>Event handling</li><li>Hooks (useState, useEffect)</li></ul>`,
        codeExample: `import React, { useState, useEffect } from 'react';\n\n// Functional component with hooks\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    async function fetchUser() {\n      try {\n        const response = await fetch(\`/api/users/\${userId}\`);\n        const userData = await response.json();\n        setUser(userData);\n      } catch (error) {\n        console.error('Failed to fetch user:', error);\n      } finally {\n        setLoading(false);\n      }\n    }\n\n    fetchUser();\n  }, [userId]);\n\n  if (loading) return <div>Loading...</div>;\n  if (!user) return <div>User not found</div>;\n\n  return (\n    <div className="user-profile">\n      <h2>{user.name}</h2>\n      <p>Email: {user.email}</p>\n    </div>\n  );\n}`,
        language: "react", difficulty: "intermediate", readTime: 22, order: 1, nextTutorial: "python-basics", prevTutorial: "typescript-basics"
      },

      // Python
      {
        id: "python-basics", courseId: "python", title: "Python Fundamentals", slug: "python-fundamentals",
        content: `<h2>Python Programming Basics</h2><p>Python is a versatile, readable programming language. Perfect for beginners and powerful for experts.</p><h3>Core Concepts</h3><ul><li>Variables and data types</li><li>Control structures</li><li>Functions and modules</li><li>Object-oriented programming</li></ul>`,
        codeExample: `# Variables and data types\nname = "Alice"\nage = 30\nheight = 5.6\nis_student = False\n\n# Lists and dictionaries\nfruits = ["apple", "banana", "cherry"]\nperson = {\n    "name": "Bob",\n    "age": 25,\n    "city": "New York"\n}\n\n# Functions\ndef calculate_area(radius):\n    import math\n    return math.pi * radius ** 2\n\n# Classes\nclass Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    \n    def study(self, subject):\n        return f"{self.name} is studying {subject}"\n\n# Usage\nstudent = Student("Charlie", "A")\nprint(student.study("Python"))`,
        language: "python", difficulty: "beginner", readTime: 16, order: 1, nextTutorial: "python-web", prevTutorial: "react-basics"
      },
      {
        id: "python-web", courseId: "python", title: "Python Web Development", slug: "python-web-development",
        content: `<h2>Web Development with Python</h2><p>Build web applications using Flask or Django. Learn routing, templates, and database integration.</p><h3>Web Framework Features</h3><ul><li>URL routing</li><li>Template rendering</li><li>Database ORM</li><li>API development</li></ul>`,
        codeExample: `# Flask web application\nfrom flask import Flask, render_template, request, jsonify\nfrom flask_sqlalchemy import SQLAlchemy\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'\ndb = SQLAlchemy(app)\n\n# Database model\nclass User(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    email = db.Column(db.String(120), unique=True, nullable=False)\n\n# Routes\n@app.route('/')\ndef home():\n    return render_template('index.html')\n\n@app.route('/api/users', methods=['POST'])\ndef create_user():\n    data = request.get_json()\n    user = User(name=data['name'], email=data['email'])\n    db.session.add(user)\n    db.session.commit()\n    return jsonify({'message': 'User created successfully'})\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
        language: "python", difficulty: "advanced", readTime: 28, order: 2, nextTutorial: "java-basics", prevTutorial: "python-basics"
      },

      // Java
      {
        id: "java-basics", courseId: "java", title: "Java Fundamentals", slug: "java-fundamentals",
        content: `<h2>Java Programming</h2><p>Java is a robust, object-oriented programming language. Learn classes, inheritance, and enterprise development.</p><h3>Java Features</h3><ul><li>Object-oriented programming</li><li>Strong typing</li><li>Platform independence</li><li>Memory management</li></ul>`,
        codeExample: `// Main class\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        \n        // Create objects\n        Student student = new Student("Alice", 20);\n        student.displayInfo();\n    }\n}\n\n// Student class\nclass Student {\n    private String name;\n    private int age;\n    \n    // Constructor\n    public Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    // Methods\n    public void displayInfo() {\n        System.out.println("Name: " + name + ", Age: " + age);\n    }\n    \n    // Getters and setters\n    public String getName() { return name; }\n    public void setName(String name) { this.name = name; }\n}`,
        language: "java", difficulty: "intermediate", readTime: 20, order: 1, nextTutorial: "nodejs-basics", prevTutorial: "python-web"
      },

      // Node.js
      {
        id: "nodejs-basics", courseId: "nodejs", title: "Node.js Server Development", slug: "nodejs-server-development",
        content: `<h2>Server-Side JavaScript</h2><p>Node.js enables JavaScript on the server. Build APIs, web servers, and full-stack applications.</p><h3>Node.js Capabilities</h3><ul><li>Event-driven architecture</li><li>NPM package management</li><li>Express.js framework</li><li>Database integration</li></ul>`,
        codeExample: `// Express.js server\nconst express = require('express');\nconst cors = require('cors');\nconst mongoose = require('mongoose');\n\nconst app = express();\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// MongoDB connection\nmongoose.connect('mongodb://localhost:27017/myapp');\n\n// User schema\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: String,\n  createdAt: { type: Date, default: Date.now }\n});\n\nconst User = mongoose.model('User', userSchema);\n\n// Routes\napp.get('/api/users', async (req, res) => {\n  try {\n    const users = await User.find();\n    res.json(users);\n  } catch (error) {\n    res.status(500).json({ error: error.message });\n  }\n});\n\napp.post('/api/users', async (req, res) => {\n  try {\n    const user = new User(req.body);\n    await user.save();\n    res.status(201).json(user);\n  } catch (error) {\n    res.status(400).json({ error: error.message });\n  }\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});`,
        language: "nodejs", difficulty: "advanced", readTime: 25, order: 1, nextTutorial: "sql-basics", prevTutorial: "java-basics"
      },

      // SQL
      {
        id: "sql-basics", courseId: "sql", title: "SQL Database Fundamentals", slug: "sql-database-fundamentals",
        content: `<h2>Relational Database Management</h2><p>SQL is essential for data storage and retrieval. Master queries, joins, and database design.</p><h3>SQL Operations</h3><ul><li>CRUD operations</li><li>Joins and relationships</li><li>Indexes and optimization</li><li>Stored procedures</li></ul>`,
        codeExample: `-- Create tables with relationships\nCREATE TABLE users (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE posts (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    user_id INT,\n    title VARCHAR(200),\n    content TEXT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\n-- Insert sample data\nINSERT INTO users (name, email) VALUES \n('John Doe', 'john@example.com'),\n('Jane Smith', 'jane@example.com');\n\nINSERT INTO posts (user_id, title, content) VALUES\n(1, 'First Post', 'This is my first blog post'),\n(2, 'Learning SQL', 'SQL is powerful for data management');\n\n-- Complex queries with joins\nSELECT \n    u.name,\n    u.email,\n    COUNT(p.id) as post_count,\n    MAX(p.created_at) as latest_post\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name, u.email\nORDER BY post_count DESC;`,
        language: "sql", difficulty: "intermediate", readTime: 22, order: 1, nextTutorial: "cybersecurity-intro", prevTutorial: "nodejs-basics"
      },

      // PROFESSIONAL CERTIFICATION TUTORIALS
      // Cybersecurity Fundamentals
      {
        id: "cybersecurity-intro", courseId: "cybersecurity-fundamentals", title: "Introduction to Cybersecurity", slug: "cybersecurity-introduction",
        content: `<h2>Cybersecurity Fundamentals</h2><p>Learn the foundations of cybersecurity including threat landscape, risk assessment, and security frameworks.</p><h3>Key Topics</h3><ul><li>CIA Triad (Confidentiality, Integrity, Availability)</li><li>Threat actors and attack vectors</li><li>Security frameworks (NIST, ISO 27001)</li><li>Risk management principles</li><li>Incident response basics</li></ul><h3>Career Path</h3><p>This course prepares you for roles in SOC analysis, incident response, and security consulting with industry-recognized certification.</p>`,
        codeExample: `# Security Assessment Script\nimport nmap\nimport subprocess\nimport json\n\nclass SecurityScanner:\n    def __init__(self, target_ip):\n        self.target = target_ip\n        self.nm = nmap.PortScanner()\n    \n    def port_scan(self):\n        \"\"\"Perform basic port scanning\"\"\"\n        print(f"Scanning {self.target}...")\n        self.nm.scan(self.target, '22-443')\n        \n        for host in self.nm.all_hosts():\n            print(f'Host: {host} ({self.nm[host].hostname()})')\n            for protocol in self.nm[host].all_protocols():\n                ports = self.nm[host][protocol].keys()\n                for port in ports:\n                    state = self.nm[host][protocol][port]['state']\n                    print(f'Port {port}: {state}')\n    \n    def vulnerability_check(self):\n        \"\"\"Basic vulnerability assessment\"\"\"\n        # Check for common vulnerabilities\n        common_ports = [21, 22, 23, 25, 53, 80, 110, 443, 993, 995]\n        open_ports = []\n        \n        for port in common_ports:\n            result = self.nm.scan(self.target, str(port))\n            if self.nm[self.target]['tcp'][port]['state'] == 'open':\n                open_ports.append(port)\n                print(f"⚠️  Port {port} is open - requires security review")\n        \n        return open_ports\n\n# Example usage\nscanner = SecurityScanner('192.168.1.1')\nscanner.port_scan()\nopen_ports = scanner.vulnerability_check()`,
        language: "python", difficulty: "intermediate", readTime: 25, order: 1, nextTutorial: "ethical-hacking-basics", prevTutorial: "sql-basics"
      },
      {
        id: "ethical-hacking-basics", courseId: "ethical-hacking", title: "Ethical Hacking Fundamentals", slug: "ethical-hacking-fundamentals",
        content: `<h2>Certified Ethical Hacker Path</h2><p>Learn professional penetration testing methodologies and ethical hacking techniques used by cybersecurity professionals.</p><h3>Penetration Testing Phases</h3><ul><li>Reconnaissance and information gathering</li><li>Scanning and enumeration</li><li>Vulnerability assessment</li><li>Exploitation techniques</li><li>Post-exploitation and reporting</li></ul><h3>Legal and Ethical Framework</h3><p>Understanding the legal boundaries, proper authorization, and ethical considerations in security testing.</p>`,
        codeExample: `#!/bin/bash\n# Ethical Hacking Reconnaissance Script\n# Always ensure proper authorization before running\n\nTARGET_DOMAIN=$1\n\nif [ -z "$TARGET_DOMAIN" ]; then\n    echo "Usage: $0 <target-domain>"\n    echo "Example: $0 example.com"\n    exit 1\nfi\n\necho "🔍 Starting reconnaissance for $TARGET_DOMAIN"\necho "⚠️  Ensure you have proper authorization!"\n\n# DNS enumeration\necho "\\n📋 DNS Information:"\nnslookup $TARGET_DOMAIN\n\n# WHOIS information\necho "\\n🏢 WHOIS Information:"\nwhois $TARGET_DOMAIN | head -20\n\n# Subdomain enumeration\necho "\\n🌐 Subdomain Discovery:"\nfor sub in www mail ftp admin test dev staging; do\n    if nslookup $sub.$TARGET_DOMAIN >/dev/null 2>&1; then\n        echo "✅ Found: $sub.$TARGET_DOMAIN"\n    fi\ndone\n\n# Port scanning (top 100 ports)\necho "\\n🔌 Port Scanning (Top 100 ports):"\nnmap -F $TARGET_DOMAIN\n\n# Web technology detection\necho "\\n💻 Web Technologies:"\ncurl -I http://$TARGET_DOMAIN 2>/dev/null | grep -E "Server|X-Powered-By|Set-Cookie"\n\necho "\\n✅ Reconnaissance complete for $TARGET_DOMAIN"\necho "📝 Remember to document findings and follow responsible disclosure!"`,
        language: "bash", difficulty: "advanced", readTime: 30, order: 1, nextTutorial: "aws-architect-intro", prevTutorial: "cybersecurity-intro"
      },

      // Cloud Computing - AWS
      {
        id: "aws-architect-intro", courseId: "aws-solutions-architect", title: "AWS Solutions Architecture", slug: "aws-solutions-architecture",
        content: `<h2>AWS Solutions Architect Professional</h2><p>Master AWS cloud architecture patterns, services integration, and enterprise-grade solutions design.</p><h3>Core AWS Services</h3><ul><li>Compute: EC2, Lambda, ECS, EKS</li><li>Storage: S3, EBS, EFS, Glacier</li><li>Database: RDS, DynamoDB, ElastiCache</li><li>Networking: VPC, CloudFront, Route 53</li><li>Security: IAM, KMS, CloudTrail</li></ul><h3>Architecture Patterns</h3><p>Learn to design scalable, secure, and cost-optimized cloud solutions following AWS Well-Architected Framework.</p>`,
        codeExample: `# AWS Infrastructure as Code with Terraform\n# Complete 3-tier web application architecture\n\nterraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = var.aws_region\n}\n\n# VPC Configuration\nresource "aws_vpc" "main" {\n  cidr_block           = "10.0.0.0/16"\n  enable_dns_hostnames = true\n  enable_dns_support   = true\n  \n  tags = {\n    Name = "production-vpc"\n    Environment = "production"\n  }\n}\n\n# Internet Gateway\nresource "aws_internet_gateway" "main" {\n  vpc_id = aws_vpc.main.id\n  \n  tags = {\n    Name = "production-igw"\n  }\n}\n\n# Public Subnets for Load Balancer\nresource "aws_subnet" "public" {\n  count_value       = 2\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = "10.0.\${\${count_value}.index + 1}.0/24"\n  availability_zone = data.aws_availability_zones.available.names[count_value.index]\n  \n  map_public_ip_on_launch = true\n  \n  tags = {\n    Name = "public-subnet-\${\${count_value}.index + 1}"\n    Type = "Public"\n  }\n}\n\n# Private Subnets for Application Servers\nresource "aws_subnet" "private" {\n  count_value       = 2\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = "10.0.\${\${count_value}.index + 10}.0/24"\n  availability_zone = data.aws_availability_zones.available.names[count_value.index]\n  \n  tags = {\n    Name = "private-subnet-\${\${count_value}.index + 1}"\n    Type = "Private"\n  }\n}\n\n# Application Load Balancer\nresource "aws_lb" "main" {\n  name               = "production-alb"\n  internal           = false\n  load_balancer_type = "application"\n  security_groups    = [aws_security_group.alb.id]\n  subnets           = aws_subnet.public[*].id\n\n  enable_deletion_protection = false\n\n  tags = {\n    Environment = "production"\n  }\n}\n\n# Auto Scaling Group\nresource "aws_autoscaling_group" "main" {\n  name                = "production-asg"\n  vpc_zone_identifier = aws_subnet.private[*].id\n  target_group_arns   = [aws_lb_target_group.main.arn]\n  health_check_type   = "ELB"\n  \n  min_size         = 2\n  max_size         = 10\n  desired_capacity = 4\n  \n  launch_template {\n    id      = aws_launch_template.main.id\n    version = "\\$Latest"\n  }\n  \n  tag {\n    key                 = "Name"\n    value               = "production-instance"\n    propagate_at_launch = true\n  }\n}`,
        language: "terraform", difficulty: "professional", readTime: 35, order: 1, nextTutorial: "ml-engineer-intro", prevTutorial: "ethical-hacking-basics"
      },

      // Machine Learning Engineering
      {
        id: "ml-engineer-intro", courseId: "machine-learning-engineer", title: "Machine Learning Engineering", slug: "machine-learning-engineering",
        content: `<h2>Professional ML Engineering</h2><p>Build production-ready machine learning systems with proper MLOps practices, model deployment, and monitoring.</p><h3>ML Engineering Pipeline</h3><ul><li>Data preprocessing and feature engineering</li><li>Model development and experimentation</li><li>Model versioning and registry</li><li>Automated training and deployment</li><li>Model monitoring and maintenance</li></ul><h3>Production ML Stack</h3><p>Learn industry-standard tools like MLflow, Kubeflow, Docker, and cloud ML services for enterprise deployment.</p>`,
        codeExample: `# Production ML Pipeline with MLflow and FastAPI\nimport mlflow\nimport mlflow.sklearn\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\nfrom sklearn.model_selection import train_test_split\nimport pandas as pd\nimport numpy as np\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nimport joblib\nimport logging\n\n# Configure logging\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\n\nclass MLPipeline:\n    def __init__(self, model_name: str):\n        self.model_name = model_name\n        self.model = None\n        \n    def preprocess_data(self, df: pd.DataFrame):\n        \"\"\"Feature engineering and preprocessing\"\"\"\n        # Handle missing values\n        df = df.fillna(df.mean())\n        \n        # Feature scaling\n        from sklearn.preprocessing import StandardScaler\n        scaler = StandardScaler()\n        \n        # Separate features and target\n        X = df.drop('target', axis=1)\n        y = df['target']\n        \n        X_scaled = scaler.fit_transform(X)\n        \n        return X_scaled, y, scaler\n    \n    def train_model(self, X_train, X_test, y_train, y_test):\n        \"\"\"Train model with MLflow tracking\"\"\"\n        with mlflow.start_run():\n            # Model parameters\n            n_estimators = 100\n            max_depth = 10\n            random_state = 42\n            \n            # Log parameters\n            mlflow.log_param("n_estimators", n_estimators)\n            mlflow.log_param("max_depth", max_depth)\n            mlflow.log_param("random_state", random_state)\n            \n            # Train model\n            self.model = RandomForestClassifier(\n                n_estimators=n_estimators,\n                max_depth=max_depth,\n                random_state=random_state\n            )\n            \n            self.model.fit(X_train, y_train)\n            \n            # Make predictions\n            y_pred = self.model.predict(X_test)\n            \n            # Calculate metrics\n            accuracy = accuracy_score(y_test, y_pred)\n            \n            # Log metrics\n            mlflow.log_metric("accuracy", accuracy)\n            \n            # Log model\n            mlflow.sklearn.log_model(\n                self.model,\n                self.model_name,\n                registered_model_name=f"production_{self.model_name}"\n            )\n            \n            logger.info(f"Model trained with accuracy: {accuracy:.4f}")\n            return accuracy\n    \n    def deploy_model(self):\n        \"\"\"Deploy model as REST API\"\"\"\n        app = FastAPI(title="ML Model API", version="1.0.0")\n        \n        class PredictionRequest(BaseModel):\n            features: list[float]\n        \n        class PredictionResponse(BaseModel):\n            prediction: int\n            probability: float\n            model_version: str\n        \n        @app.post("/predict", response_model=PredictionResponse)\n        async def predict(request: PredictionRequest):\n            try:\n                # Load latest model\n                model = mlflow.sklearn.load_model(\n                    f"models:/production_{self.model_name}/latest"\n                )\n                \n                # Make prediction\n                features = np.array(request.features).reshape(1, -1)\n                prediction = model.predict(features)[0]\n                probability = model.predict_proba(features)[0].max()\n                \n                return PredictionResponse(\n                    prediction=int(prediction),\n                    probability=float(probability),\n                    model_version="1.0.0"\n                )\n            except Exception as e:\n                raise HTTPException(status_code=500, detail=str(e))\n        \n        @app.get("/health")\n        async def health_check():\n            return {"status": "healthy", "model": self.model_name}\n        \n        return app\n\n# Usage example\nif __name__ == "__main__":\n    # Initialize ML pipeline\n    ml_pipeline = MLPipeline("fraud_detection")\n    \n    # Load and preprocess data\n    data = pd.read_csv("training_data.csv")\n    X, y, scaler = ml_pipeline.preprocess_data(data)\n    \n    # Split data\n    X_train, X_test, y_train, y_test = train_test_split(\n        X, y, test_size=0.2, random_state=42\n    )\n    \n    # Train model\n    accuracy = ml_pipeline.train_model(X_train, X_test, y_train, y_test)\n    \n    # Deploy API\n    app = ml_pipeline.deploy_model()\n    \n    # Run with: uvicorn main:app --host 0.0.0.0 --port 8000\n    print("Model API ready for deployment!")`,
        language: "python", difficulty: "professional", readTime: 40, order: 1, nextTutorial: "iot-systems-intro", prevTutorial: "aws-architect-intro"
      },

      // IoT Systems Engineering
      {
        id: "iot-systems-intro", courseId: "iot-fundamentals", title: "IoT Systems Architecture", slug: "iot-systems-architecture",
        content: `<h2>Internet of Things Engineering</h2><p>Design and implement complete IoT ecosystems with sensors, edge computing, and cloud integration.</p><h3>IoT Architecture Layers</h3><ul><li>Device Layer: Sensors, actuators, microcontrollers</li><li>Connectivity Layer: WiFi, Bluetooth, LoRaWAN, 5G</li><li>Data Processing: Edge computing, real-time analytics</li><li>Application Layer: Dashboards, automation, AI integration</li><li>Business Layer: Analytics, insights, decision making</li></ul><h3>Industry Applications</h3><p>Smart cities, industrial IoT (IIoT), healthcare monitoring, agriculture, and home automation systems.</p>`,
        codeExample: `# Complete IoT System: Smart Environmental Monitor\n# Hardware: ESP32 + DHT22 sensor + MQ135 air quality sensor\n\n# Arduino/ESP32 Code (C++)\n/*\n#include <WiFi.h>\n#include <HTTPClient.h>\n#include <ArduinoJson.h>\n#include <DHT.h>\n\n#define DHT_PIN 2\n#define DHT_TYPE DHT22\n#define MQ135_PIN A0\n#define LED_PIN 13\n\nDHT dht(DHT_PIN, DHT_TYPE);\n\nconst char* ssid = "YOUR_WIFI_SSID";\nconst char* password = "YOUR_WIFI_PASSWORD";\nconst char* serverURL = "https://your-iot-backend.com/api/sensors";\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(LED_PIN, OUTPUT);\n  \n  dht.begin();\n  \n  // Connect to WiFi\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(1000);\n    Serial.println("Connecting to WiFi...");\n  }\n  Serial.println("Connected to WiFi");\n}\n\nvoid loop() {\n  // Read sensors\n  float temperature = dht.readTemperature();\n  float humidity = dht.readHumidity();\n  int airQuality = analogRead(MQ135_PIN);\n  \n  if (isnan(temperature) || isnan(humidity)) {\n    Serial.println("Failed to read DHT sensor!");\n    return;\n  }\n  \n  // Create JSON payload\n  DynamicJsonDocument doc(1024);\n  doc["device_id"] = "ENV_001";\n  doc["timestamp"] = millis();\n  doc["temperature"] = temperature;\n  doc["humidity"] = humidity;\n  doc["air_quality"] = airQuality;\n  doc["location"] = "Office_Room_1";\n  \n  String jsonString;\n  serializeJson(doc, jsonString);\n  \n  // Send data to cloud\n  if (WiFi.status() == WL_CONNECTED) {\n    HTTPClient http;\n    http.begin(serverURL);\n    http.addHeader("Content-Type", "application/json");\n    \n    int httpResponseCode = http.POST(jsonString);\n    \n    if (httpResponseCode > 0) {\n      String response = http.getString();\n      Serial.println("Data sent successfully");\n      \n      // Blink LED to indicate success\n      digitalWrite(LED_PIN, HIGH);\n      delay(100);\n      digitalWrite(LED_PIN, LOW);\n    } else {\n      Serial.println("Error sending data");\n    }\n    \n    http.end();\n  }\n  \n  delay(30000); // Send data every 30 seconds\n}\n*/\n\n# Python Backend API (FastAPI)\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom datetime import datetime\nimport asyncio\nimport aioredis\nimport json\nfrom typing import List, Optional\n\napp = FastAPI(title="IoT Environmental Monitoring API")\n\n# Data Models\nclass SensorData(BaseModel):\n    device_id: str\n    timestamp: int\n    temperature: float\n    humidity: float\n    air_quality: int\n    location: str\n\nclass AlertThreshold(BaseModel):\n    min_temperature: float = 18.0\n    max_temperature: float = 30.0\n    max_humidity: float = 70.0\n    max_air_quality: int = 500\n\n# Redis connection for real-time data\nredis_client = None\n\n@app.on_event("startup")\nasync def startup_event():\n    global redis_client\n    redis_client = await aioredis.from_url("redis://localhost:6379")\n\nclass IoTDataProcessor:\n    def __init__(self):\n        self.alert_thresholds = AlertThreshold()\n    \n    async def process_sensor_data(self, data: SensorData):\n        \"\"\"Process incoming sensor data and trigger alerts\"\"\"\n        # Store in Redis for real-time access\n        await redis_client.setex(\n            f"sensor:{data.device_id}:latest",\n            3600,  # 1 hour TTL\n            json.dumps(data.dict())\n        )\n        \n        # Check for alerts\n        alerts = self.check_alerts(data)\n        if alerts:\n            await self.send_alerts(data, alerts)\n        \n        # Store historical data (would typically go to InfluxDB/TimescaleDB)\n        await self.store_historical_data(data)\n        \n        return {"status": "success", "alerts": alerts}\n    \n    def check_alerts(self, data: SensorData) -> List[str]:\n        \"\"\"Check sensor data against alert thresholds\"\"\"\n        alerts = []\n        \n        if data.temperature < self.alert_thresholds.min_temperature:\n            alerts.append(f"Low temperature alert: {data.temperature}°C")\n        elif data.temperature > self.alert_thresholds.max_temperature:\n            alerts.append(f"High temperature alert: {data.temperature}°C")\n        \n        if data.humidity > self.alert_thresholds.max_humidity:\n            alerts.append(f"High humidity alert: {data.humidity}%")\n        \n        if data.air_quality > self.alert_thresholds.max_air_quality:\n            alerts.append(f"Poor air quality alert: {data.air_quality}")\n        \n        return alerts\n    \n    async def send_alerts(self, data: SensorData, alerts: List[str]):\n        \"\"\"Send alerts via multiple channels\"\"\"\n        alert_payload = {\n            "device_id": data.device_id,\n            "location": data.location,\n            "timestamp": datetime.now().isoformat(),\n            "alerts": alerts,\n            "current_readings": {\n                "temperature": data.temperature,\n                "humidity": data.humidity,\n                "air_quality": data.air_quality\n            }\n        }\n        \n        # Publish to alert channel\n        await redis_client.publish("iot_alerts", json.dumps(alert_payload))\n        \n        # Log alert\n        print(f"🚨 ALERT for {data.device_id}: {alerts}")\n    \n    async def store_historical_data(self, data: SensorData):\n        \"\"\"Store data for historical analysis\"\"\"\n        # In production, use InfluxDB or similar time-series database\n        await redis_client.lpush(\n            f"sensor:{data.device_id}:history",\n            json.dumps(data.dict())\n        )\n        # Keep only last 1000 readings\n        await redis_client.ltrim(f"sensor:{data.device_id}:history", 0, 999)\n\n# Initialize processor\nprocessor = IoTDataProcessor()\n\n@app.post("/api/sensors")\nasync def receive_sensor_data(data: SensorData):\n    \"\"\"Receive sensor data from IoT devices\"\"\"\n    try:\n        result = await processor.process_sensor_data(data)\n        return result\n    except Exception as e:\n        raise HTTPException(status_code=500, detail=str(e))\n\n@app.get("/api/sensors/{device_id}/latest")\nasync def get_latest_data(device_id: str):\n    \"\"\"Get latest sensor data for a device\"\"\"\n    data = await redis_client.get(f"sensor:{device_id}:latest")\n    if data:\n        return json.loads(data)\n    else:\n        raise HTTPException(status_code=404, detail="Device not found")\n\n@app.get("/api/dashboard")\nasync def get_dashboard_data():\n    \"\"\"Get dashboard summary for all devices\"\"\"\n    # Get all device keys\n    keys = await redis_client.keys("sensor:*:latest")\n    devices_data = []\n    \n    for key in keys:\n        data = await redis_client.get(key)\n        if data:\n            devices_data.append(json.loads(data))\n    \n    return {\n        "total_devices": len(devices_data),\n        "active_devices": len([d for d in devices_data if \n                             datetime.now().timestamp() - d['timestamp']/1000 < 300]),  # 5 min\n        "devices": devices_data\n    }\n\nif __name__ == "__main__":\n    import uvicorn\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n    \n# WebSocket for real-time dashboard updates\n@app.websocket("/ws/dashboard")\nasync def dashboard_websocket(websocket):\n    await websocket.accept()\n    \n    # Subscribe to Redis alerts channel\n    pubsub = redis_client.pubsub()\n    await pubsub.subscribe("iot_alerts")\n    \n    try:\n        while True:\n            message = await pubsub.get_message(ignore_subscribe_messages=True)\n            if message:\n                await websocket.send_text(message['data'].decode())\n            await asyncio.sleep(0.1)\n    except Exception as e:\n        print(f"WebSocket error: {e}")\n    finally:\n        await pubsub.unsubscribe("iot_alerts")\n        await websocket.close()`,
        language: "python", difficulty: "advanced", readTime: 45, order: 1, nextTutorial: null, prevTutorial: "ml-engineer-intro"
      }
    ];

    // Add all tutorials to the map
    tutorialData.forEach(tutorial => {
      this.tutorials.set(tutorial.id, tutorial);
    });
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).sort((a, b) => a.order - b.order);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const newCourse: Course = { ...course, id, order: course.order || 0 };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async getTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).sort((a, b) => a.order - b.order);
  }

  async getTutorialsByCategory(category: string): Promise<Tutorial[]> {
    const courses = await this.getCourses();
    const categoryIds = courses.filter(c => c.category === category).map(c => c.id);
    return Array.from(this.tutorials.values())
      .filter(t => categoryIds.includes(t.courseId))
      .sort((a, b) => a.order - b.order);
  }

  async getTutorialsByCourse(courseId: string): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values())
      .filter(t => t.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getTutorial(id: string): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }

  async getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
    return Array.from(this.tutorials.values()).find(t => t.slug === slug);
  }

  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const id = randomUUID();
    const newTutorial: Tutorial = { 
      ...tutorial, 
      id, 
      order: tutorial.order || 0,
      readTime: tutorial.readTime || 10,
      nextTutorial: tutorial.nextTutorial || null,
      prevTutorial: tutorial.prevTutorial || null
    };
    this.tutorials.set(id, newTutorial);
    return newTutorial;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async updateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const newProgress: UserProgress = { ...progress, id };
    this.userProgress.set(id, newProgress);
    return newProgress;
  }

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(q => q.courseId === courseId);
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const newQuiz: Quiz = { ...quiz, id };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  // Exam methods
  async getExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }

  async getExamsByCourse(courseId: string): Promise<Exam[]> {
    return Array.from(this.exams.values()).filter(e => e.courseId === courseId);
  }

  async getExam(id: string): Promise<Exam | undefined> {
    return this.exams.get(id);
  }

  async createExam(exam: InsertExam): Promise<Exam> {
    const id = randomUUID();
    const newExam: Exam = { ...exam, id };
    this.exams.set(id, newExam);
    return newExam;
  }

  // Certificate methods
  async getCertificates(): Promise<Certificate[]> {
    return Array.from(this.certificates.values());
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(c => c.userId === userId);
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const id = randomUUID();
    const certificateNumber = `SUP-${Date.now().toString(36).toUpperCase()}-${randomUUID().substring(0, 8).toUpperCase()}`;
    const newCertificate: Certificate = { 
      ...certificate, 
      id, 
      certificateNumber,
      issuedAt: new Date().toISOString()
    };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }
}

export const storage = new MemStorage();
