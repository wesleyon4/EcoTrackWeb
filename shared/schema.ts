import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow()
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  carbonFootprint: real("carbon_footprint"),
  materials: jsonb("materials"),
  recyclability: text("recyclability"),
  ecoScore: text("eco_score"),
  ecoScoreValue: integer("eco_score_value"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow()
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  productId: integer("product_id"),
  scannedAt: timestamp("scanned_at").defaultNow()
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  readTime: integer("read_time"),
  createdAt: timestamp("created_at").defaultNow()
});

export const recyclingCenters = pgTable("recycling_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  acceptedMaterials: jsonb("accepted_materials"),
  operatingHours: text("operating_hours"),
  distance: real("distance")
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});

export const insertScanSchema = createInsertSchema(scans).omit({
  id: true,
  scannedAt: true
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true
});

export const insertRecyclingCenterSchema = createInsertSchema(recyclingCenters).omit({
  id: true,
  distance: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertRecyclingCenter = z.infer<typeof insertRecyclingCenterSchema>;
export type RecyclingCenter = typeof recyclingCenters.$inferSelect;
