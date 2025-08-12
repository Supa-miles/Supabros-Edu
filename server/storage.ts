import { type Course, type Tutorial, type UserProgress, type InsertCourse, type InsertTutorial, type InsertUserProgress } from "@shared/schema";
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
  
  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private courses: Map<string, Course> = new Map();
  private tutorials: Map<string, Tutorial> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();

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
      { id: "verilog", title: "Verilog", description: "Hardware description and verification language", icon: "fas fa-circuit-board", category: "hardware", color: "#B83998", order: 52 }
    ];

    courseData.forEach(course => {
      this.courses.set(course.id, course);
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
        language: "sql", difficulty: "intermediate", readTime: 22, order: 1, nextTutorial: null, prevTutorial: "nodejs-basics"
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
}

export const storage = new MemStorage();
