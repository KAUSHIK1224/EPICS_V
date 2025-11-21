import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deviceTokens: jsonb("device_tokens").default(sql`'[]'::jsonb`),
  notificationPreferences: jsonb("notification_preferences").default(sql`'{"rare":true,"nearby":true,"events":true,"weather":true,"radiusMeters":500}'::jsonb`),
  lastKnownLocation: jsonb("last_known_location"),
});

export const species = pgTable("species", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  commonName: text("common_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  tamilName: text("tamil_name"),
  status: text("status").notNull(),
  size: text("size"),
  weight: text("weight"),
  habitat: text("habitat"),
  season: text("season"),
  description: text("description"),
  imageUrl: text("image_url"),
  arModelUrl: text("ar_model_url"),
  conservationStatus: text("conservation_status"),
  eBirdCode: text("ebird_code"),
  birdwatchingTips: text("birdwatching_tips"),
  callDescription: text("call_description"),
  dietaryHabits: text("dietary_habits"),
});

export const sightings = pgTable("sightings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  speciesId: varchar("species_id").references(() => species.id, { onDelete: "set null" }),
  location: text("location"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes"),
  imageUrl: text("image_url"),
  verified: boolean("verified").notNull().default(false),
  confidence: real("confidence"),
  identifiedSpecies: text("identified_species"),
  temperature: real("temperature"),
  weatherCondition: text("weather_condition"),
  humidity: real("humidity"),
  windSpeed: real("wind_speed"),
  isPublic: boolean("is_public").notNull().default(true),
  likes: integer("likes").notNull().default(0),
  rare: boolean("rare").default(false),
  notifyNearby: boolean("notify_nearby").default(false),
}, (table) => ({
  userIdx: index("sightings_user_idx").on(table.userId),
  locationIdx: index("sightings_location_idx").on(table.latitude, table.longitude),
  dateIdx: index("sightings_date_idx").on(table.date),
}));

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  pointsRequired: integer("points_required").notNull(),
  badgeType: text("badge_type").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
}, (table) => ({
  userAchievementUnique: sql`UNIQUE (${table.userId}, ${table.achievementId})`,
}));

export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedTime: integer("estimated_time"),
  imageUrl: text("image_url"),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id").notNull().references(() => learningModules.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  userModuleUnique: sql`UNIQUE (${table.userId}, ${table.moduleId})`,
}));

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sightingId: varchar("sighting_id").references(() => sightings.id, { onDelete: "cascade" }),
  caption: text("caption").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdx: index("posts_user_idx").on(table.userId),
  createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
}));

export const sanctuaryHotspots = pgTable("sanctuary_hotspots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  commonSpecies: text("common_species"),
  bestVisitTime: text("best_visit_time"),
  difficulty: text("difficulty"),
  imageUrl: text("image_url"),
}, (table) => ({
  locationIdx: index("hotspots_location_idx").on(table.latitude, table.longitude),
}));

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(),
  data: jsonb("data"),
  recipientCount: integer("recipient_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
  points: true,
  createdAt: true,
  deviceTokens: true,
  notificationPreferences: true,
  lastKnownLocation: true,
});

export const insertSpeciesSchema = createInsertSchema(species).omit({
  id: true,
});

export const insertSightingSchema = createInsertSchema(sightings).omit({
  id: true,
  verified: true,
  confidence: true,
  identifiedSpecies: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSpecies = z.infer<typeof insertSpeciesSchema>;
export type Species = typeof species.$inferSelect;

export type InsertSighting = z.infer<typeof insertSightingSchema>;
export type Sighting = typeof sightings.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

export type UserProgress = typeof userProgress.$inferSelect;

export type CommunityPost = typeof communityPosts.$inferSelect;
export type SanctuaryHotspot = typeof sanctuaryHotspots.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export const insertHotspotSchema = createInsertSchema(sanctuaryHotspots).omit({
  id: true,
});

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type InsertHotspot = z.infer<typeof insertHotspotSchema>;
