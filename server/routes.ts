import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTutorialSchema, insertCourseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Tutorials
  app.get("/api/tutorials", async (req, res) => {
    try {
      const { category, courseId } = req.query;
      let tutorials;
      
      if (category) {
        tutorials = await storage.getTutorialsByCategory(category as string);
      } else if (courseId) {
        tutorials = await storage.getTutorialsByCourse(courseId as string);
      } else {
        tutorials = await storage.getTutorials();
      }
      
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorials" });
    }
  });

  app.get("/api/tutorials/:slug", async (req, res) => {
    try {
      const tutorial = await storage.getTutorialBySlug(req.params.slug);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorial" });
    }
  });

  app.post("/api/tutorials", async (req, res) => {
    try {
      const validatedData = insertTutorialSchema.parse(req.body);
      const tutorial = await storage.createTutorial(validatedData);
      res.status(201).json(tutorial);
    } catch (error) {
      res.status(400).json({ message: "Invalid tutorial data" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.json([]);
      }

      const tutorials = await storage.getTutorials();
      const results = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(q.toLowerCase()) ||
        tutorial.content.toLowerCase().includes(q.toLowerCase())
      );

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
