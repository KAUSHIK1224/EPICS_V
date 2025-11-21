import { db } from "./db";
import { eq, and } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import {
  type User,
  type InsertUser,
  type Species,
  type InsertSpecies,
  type Sighting,
  type InsertSighting,
  type Achievement,
  type InsertAchievement,
  type LearningModule,
  type InsertLearningModule,
  type UserProgress,
  users,
  species,
  sightings,
  achievements,
  userAchievements,
  learningModules,
  userProgress,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<void>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;

  // Species
  getAllSpecies(): Promise<Species[]>;
  getSpecies(id: string): Promise<Species | undefined>;
  createSpecies(speciesData: InsertSpecies): Promise<Species>;
  updateSpecies(id: string, speciesData: Partial<InsertSpecies>): Promise<Species | undefined>;
  deleteSpecies(id: string): Promise<void>;

  // Sightings
  getAllSightings(): Promise<Sighting[]>;
  getSightingsByUser(userId: string): Promise<Sighting[]>;
  getSighting(id: string): Promise<Sighting | undefined>;
  createSighting(sightingData: InsertSighting): Promise<Sighting>;
  updateSighting(id: string, updates: Partial<Sighting>): Promise<Sighting | undefined>;
  
  // Achievements
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievementData: InsertAchievement): Promise<Achievement>;
  awardAchievement(userId: string, achievementId: string): Promise<void>;
  
  // Learning Modules
  getAllLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;
  createLearningModule(moduleData: InsertLearningModule): Promise<LearningModule>;
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(userId: string, moduleId: string, completed: boolean): Promise<void>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    await db.update(users).set({ points }).where(eq(users.id, userId));
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Species
  async getAllSpecies(): Promise<Species[]> {
    return await db.select().from(species);
  }

  async getSpecies(id: string): Promise<Species | undefined> {
    const [speciesData] = await db.select().from(species).where(eq(species.id, id));
    return speciesData;
  }

  async createSpecies(speciesData: InsertSpecies): Promise<Species> {
    const [newSpecies] = await db.insert(species).values(speciesData).returning();
    return newSpecies;
  }

  async updateSpecies(id: string, speciesData: Partial<InsertSpecies>): Promise<Species | undefined> {
    const [updated] = await db.update(species).set(speciesData).where(eq(species.id, id)).returning();
    return updated;
  }

  async deleteSpecies(id: string): Promise<void> {
    await db.delete(species).where(eq(species.id, id));
  }

  // Sightings
  async getAllSightings(): Promise<Sighting[]> {
    return await db.select().from(sightings);
  }

  async getSightingsByUser(userId: string): Promise<Sighting[]> {
    return await db.select().from(sightings).where(eq(sightings.userId, userId));
  }

  async getSighting(id: string): Promise<Sighting | undefined> {
    const [sighting] = await db.select().from(sightings).where(eq(sightings.id, id));
    return sighting;
  }

  async createSighting(sightingData: InsertSighting): Promise<Sighting> {
    const [newSighting] = await db.insert(sightings).values(sightingData).returning();
    return newSighting;
  }

  async updateSighting(id: string, updates: Partial<Sighting>): Promise<Sighting | undefined> {
    const [updated] = await db.update(sightings).set(updates).where(eq(sightings.id, id)).returning();
    return updated;
  }

  // Achievements
  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const userAchs = await db
      .select({
        id: achievements.id,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        pointsRequired: achievements.pointsRequired,
        badgeType: achievements.badgeType,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
    return userAchs;
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievementData).returning();
    return newAchievement;
  }

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    await db.insert(userAchievements).values({ userId, achievementId });
  }

  // Learning Modules
  async getAllLearningModules(): Promise<LearningModule[]> {
    return await db.select().from(learningModules);
  }

  async getLearningModule(id: string): Promise<LearningModule | undefined> {
    const [module] = await db.select().from(learningModules).where(eq(learningModules.id, id));
    return module;
  }

  async createLearningModule(moduleData: InsertLearningModule): Promise<LearningModule> {
    const [newModule] = await db.insert(learningModules).values(moduleData).returning();
    return newModule;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(userId: string, moduleId: string, completed: boolean): Promise<void> {
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));

    if (existing) {
      await db
        .update(userProgress)
        .set({ completed, completedAt: completed ? new Date() : null })
        .where(eq(userProgress.id, existing.id));
    } else {
      await db.insert(userProgress).values({
        userId,
        moduleId,
        completed,
        completedAt: completed ? new Date() : null,
      });
    }
  }
}

export const storage = new DbStorage();
