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
    // Seed courses
    const frontendCourse: Course = {
      id: "frontend",
      title: "Frontend Development",
      description: "Learn HTML, CSS, JavaScript and modern frameworks",
      icon: "fas fa-laptop-code",
      category: "frontend",
      color: "#3B82F6",
      order: 1,
    };

    const backendCourse: Course = {
      id: "backend",
      title: "Backend Development",
      description: "Server-side programming and databases",
      icon: "fas fa-server",
      category: "backend",
      color: "#10B981",
      order: 2,
    };

    const databaseCourse: Course = {
      id: "database",
      title: "Database",
      description: "SQL and NoSQL database management",
      icon: "fas fa-database",
      category: "database",
      color: "#8B5CF6",
      order: 3,
    };

    this.courses.set(frontendCourse.id, frontendCourse);
    this.courses.set(backendCourse.id, backendCourse);
    this.courses.set(databaseCourse.id, databaseCourse);

    // Seed tutorials
    const htmlTutorial: Tutorial = {
      id: "html-intro",
      courseId: "frontend",
      title: "HTML Introduction",
      slug: "html-introduction",
      content: `<h2>What is HTML?</h2>
      <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements and tags.</p>
      
      <h3>HTML Structure</h3>
      <p>An HTML document has a basic structure with essential elements:</p>
      <ul>
        <li><code>&lt;!DOCTYPE html&gt;</code> - Declares the document type</li>
        <li><code>&lt;html&gt;</code> - Root element of the page</li>
        <li><code>&lt;head&gt;</code> - Contains metadata about the document</li>
        <li><code>&lt;body&gt;</code> - Contains the visible content</li>
      </ul>`,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>`,
      language: "html",
      difficulty: "beginner",
      readTime: 10,
      order: 1,
      nextTutorial: "css-intro",
      prevTutorial: null,
    };

    const cssTutorial: Tutorial = {
      id: "css-intro",
      courseId: "frontend",
      title: "CSS Introduction",
      slug: "css-introduction",
      content: `<h2>What is CSS?</h2>
      <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It describes how HTML elements should be displayed.</p>
      
      <h3>CSS Syntax</h3>
      <p>CSS consists of selectors and declarations:</p>
      <ul>
        <li><strong>Selector</strong> - Points to the HTML element you want to style</li>
        <li><strong>Declaration</strong> - Contains properties and values</li>
      </ul>`,
      codeExample: `/* CSS Syntax */
h1 {
    color: #04AA6D;
    font-size: 2rem;
    text-align: center;
}

p {
    color: #333;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,
      language: "css",
      difficulty: "beginner",
      readTime: 12,
      order: 2,
      nextTutorial: "js-variables",
      prevTutorial: "html-intro",
    };

    const jsTutorial: Tutorial = {
      id: "js-variables",
      courseId: "frontend",
      title: "JavaScript Variables",
      slug: "javascript-variables",
      content: `<h2>JavaScript Variables</h2>
      <p>Variables are containers for storing data values. In JavaScript, you can create variables using <code>var</code>, <code>let</code>, or <code>const</code> keywords.</p>
      
      <h3>Variable Declaration</h3>
      <p>Each keyword has different rules about scope and reassignment:</p>
      <ul>
        <li><code>var</code> - Function-scoped, can be reassigned</li>
        <li><code>let</code> - Block-scoped, can be reassigned</li>
        <li><code>const</code> - Block-scoped, cannot be reassigned</li>
      </ul>`,
      codeExample: `// Using var (function-scoped)
var name = "John";

// Using let (block-scoped)
let age = 25;

// Using const (block-scoped, immutable)
const PI = 3.14159;

// Variables can store different data types
let message = "Hello, World!";
let number = 42;
let isActive = true;
let items = ["apple", "banana", "orange"];

console.log(name, age, PI);`,
      language: "javascript",
      difficulty: "beginner",
      readTime: 15,
      order: 3,
      nextTutorial: "python-intro",
      prevTutorial: "css-intro",
    };

    const pythonTutorial: Tutorial = {
      id: "python-intro",
      courseId: "backend",
      title: "Python Introduction",
      slug: "python-introduction",
      content: `<h2>What is Python?</h2>
      <p>Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used for web development, data science, and automation.</p>
      
      <h3>Python Syntax</h3>
      <p>Python uses indentation to define code blocks, making it clean and readable:</p>`,
      codeExample: `# Python Variables and Data Types
name = "Alice"
age = 30
height = 5.6
is_student = False

# Lists
fruits = ["apple", "banana", "orange"]

# Dictionaries
person = {
    "name": "Bob",
    "age": 25,
    "city": "New York"
}

# Functions
def greet(name):
    return f"Hello, {name}!"

# Print output
print(greet(name))
print(f"Age: {age}, Height: {height}")`,
      language: "python",
      difficulty: "beginner",
      readTime: 12,
      order: 1,
      nextTutorial: "sql-intro",
      prevTutorial: "js-variables",
    };

    const sqlTutorial: Tutorial = {
      id: "sql-intro",
      courseId: "database",
      title: "SQL Introduction",
      slug: "sql-introduction",
      content: `<h2>What is SQL?</h2>
      <p>SQL (Structured Query Language) is a programming language designed for managing and manipulating relational databases.</p>
      
      <h3>Basic SQL Commands</h3>
      <p>The most common SQL operations are:</p>
      <ul>
        <li><code>SELECT</code> - Retrieve data from tables</li>
        <li><code>INSERT</code> - Add new records</li>
        <li><code>UPDATE</code> - Modify existing records</li>
        <li><code>DELETE</code> - Remove records</li>
      </ul>`,
      codeExample: `-- Create a table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT
);

-- Insert data
INSERT INTO users (name, email, age) 
VALUES ('John Doe', 'john@example.com', 25);

-- Select data
SELECT * FROM users;
SELECT name, email FROM users WHERE age > 18;

-- Update data
UPDATE users SET age = 26 WHERE name = 'John Doe';

-- Delete data
DELETE FROM users WHERE age < 18;`,
      language: "sql",
      difficulty: "beginner",
      readTime: 18,
      order: 1,
      nextTutorial: null,
      prevTutorial: "python-intro",
    };

    this.tutorials.set(htmlTutorial.id, htmlTutorial);
    this.tutorials.set(cssTutorial.id, cssTutorial);
    this.tutorials.set(jsTutorial.id, jsTutorial);
    this.tutorials.set(pythonTutorial.id, pythonTutorial);
    this.tutorials.set(sqlTutorial.id, sqlTutorial);
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).sort((a, b) => a.order - b.order);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const newCourse: Course = { ...course, id };
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
    const newTutorial: Tutorial = { ...tutorial, id };
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
