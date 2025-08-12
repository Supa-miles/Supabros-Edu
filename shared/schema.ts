import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  color: text("color").notNull(),
  order: integer("order").notNull().default(0),
  certificateAvailable: boolean("certificate_available").default(false),
  examRequired: boolean("exam_required").default(false),
  duration: text("duration"), // e.g., "8 weeks", "3 months"
  level: text("level").default("beginner"), // beginner, intermediate, advanced, professional
});

export const tutorials = pgTable("tutorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  codeExample: text("code_example"),
  language: text("language").default("javascript"),
  difficulty: text("difficulty").notNull().default("beginner"),
  readTime: integer("read_time").notNull().default(10),
  order: integer("order").notNull().default(0),
  nextTutorial: varchar("next_tutorial"),
  prevTutorial: varchar("prev_tutorial"),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  tutorialId: varchar("tutorial_id").references(() => tutorials.id),
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(),
  passingScore: integer("passing_score").notNull().default(70),
  timeLimit: integer("time_limit").default(30), // in minutes
  order: integer("order").notNull().default(0),
});

export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  questions: jsonb("questions").notNull(),
  passingScore: integer("passing_score").notNull().default(80),
  timeLimit: integer("time_limit").notNull().default(120), // in minutes
  certificateTemplate: text("certificate_template"),
});

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  examId: varchar("exam_id").notNull().references(() => exams.id),
  score: integer("score").notNull(),
  issuedAt: text("issued_at"),
  certificateNumber: text("certificate_number").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  tutorialId: varchar("tutorial_id").references(() => tutorials.id),
  quizId: varchar("quiz_id").references(() => quizzes.id),
  courseId: varchar("course_id").references(() => courses.id),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  completedAt: text("completed_at"),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertTutorialSchema = createInsertSchema(tutorials).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
});

export type Course = typeof courses.$inferSelect;
export type Tutorial = typeof tutorials.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Exam = typeof exams.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
