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

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  tutorialId: varchar("tutorial_id").notNull().references(() => tutorials.id),
  completed: boolean("completed").notNull().default(false),
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

export type Course = typeof courses.$inferSelect;
export type Tutorial = typeof tutorials.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
