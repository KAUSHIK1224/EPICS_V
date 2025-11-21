import { db } from "./db";
import { eq, and, sql, lt, gt, lte, gte } from "drizzle-orm";
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
  type CommunityPost,
  type InsertCommunityPost,
  type SanctuaryHotspot,
  type InsertHotspot,
  users,
  species,
  sightings,
  achievements,
  userAchievements,
  learningModules,
  userProgress,
  communityPosts,
  sanctuaryHotspots,
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

  // Community Features
  getAllCommunityPosts(): Promise<CommunityPost[]>;
  getUserPosts(userId: string): Promise<CommunityPost[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(postData: InsertCommunityPost): Promise<CommunityPost>;
  likePost(postId: string): Promise<void>;

  // Hotspots
  getAllHotspots(): Promise<SanctuaryHotspot[]>;
  
  // Analytics
  getAnalytics(): Promise<{
    totalSpecies: number;
    totalSightings: number;
    topSpecies: Array<{ name: string; count: number; conservationStatus: string }>;
    migrationData: Array<{ month: string; count: number }>;
    seasonalData: Array<{ season: string; count: number }>;
  }>;
  getNearbyHotspots(latitude: number, longitude: number, radiusKm: number): Promise<SanctuaryHotspot[]>;
  createHotspot(hotspotData: InsertHotspot): Promise<SanctuaryHotspot>;

  // Observations (Geo-location based)
  getNearbyObservations(latitude: number, longitude: number, radiusKm: number): Promise<Sighting[]>;

  // Search
  searchSpecies(query: string): Promise<Species[]>;
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

  // Community Features
  async getAllCommunityPosts(): Promise<CommunityPost[]> {
    return await db.select().from(communityPosts).orderBy(sql`${communityPosts.createdAt} DESC`);
  }

  async getUserPosts(userId: string): Promise<CommunityPost[]> {
    return await db.select().from(communityPosts).where(eq(communityPosts.userId, userId)).orderBy(sql`${communityPosts.createdAt} DESC`);
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    return post;
  }

  async createCommunityPost(postData: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db.insert(communityPosts).values(postData).returning();
    return newPost;
  }

  async likePost(postId: string): Promise<void> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, postId));
    if (post) {
      await db.update(communityPosts).set({ likes: post.likes + 1 }).where(eq(communityPosts.id, postId));
    }
  }

  // Hotspots
  async getAllHotspots(): Promise<SanctuaryHotspot[]> {
    return await db.select().from(sanctuaryHotspots);
  }

  async getNearbyHotspots(latitude: number, longitude: number, radiusKm: number): Promise<SanctuaryHotspot[]> {
    const radiusInDegrees = radiusKm / 111;
    return await db
      .select()
      .from(sanctuaryHotspots)
      .where(
        and(
          gte(sanctuaryHotspots.latitude, latitude - radiusInDegrees),
          lte(sanctuaryHotspots.latitude, latitude + radiusInDegrees),
          gte(sanctuaryHotspots.longitude, longitude - radiusInDegrees),
          lte(sanctuaryHotspots.longitude, longitude + radiusInDegrees)
        )
      );
  }

  async createHotspot(hotspotData: InsertHotspot): Promise<SanctuaryHotspot> {
    const [newHotspot] = await db.insert(sanctuaryHotspots).values(hotspotData).returning();
    return newHotspot;
  }

  // Observations (Geo-location based)
  async getNearbyObservations(latitude: number, longitude: number, radiusKm: number): Promise<Sighting[]> {
    const radiusInDegrees = radiusKm / 111;
    try {
      const result = await db
        .select()
        .from(sightings)
        .where(
          and(
            gte(sightings.latitude, latitude - radiusInDegrees),
            lte(sightings.latitude, latitude + radiusInDegrees),
            gte(sightings.longitude, longitude - radiusInDegrees),
            lte(sightings.longitude, longitude + radiusInDegrees)
          )
        )
        .limit(100);
      return result || [];
    } catch (error) {
      console.error("Error fetching nearby observations:", error);
      return [];
    }
  }

  // Search
  async searchSpecies(query: string): Promise<Species[]> {
    try {
      const lowerQuery = query.toLowerCase();
      const result = await db.select().from(species).limit(50);
      return result.filter(
        (s) =>
          s.commonName?.toLowerCase().includes(lowerQuery) ||
          s.scientificName?.toLowerCase().includes(lowerQuery) ||
          s.tamilName?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching species:", error);
      return [];
    }
  }

  // Analytics
  async getAnalytics() {
    try {
      const allSightings = await this.getAllSightings();
      const allSpecies = await this.getAllSpecies();
      
      // Map species ID to sighting count
      const speciesSightingsMap = new Map<string, number>();
      allSightings.forEach(s => {
        if (s.speciesId) {
          speciesSightingsMap.set(s.speciesId, (speciesSightingsMap.get(s.speciesId) || 0) + 1);
        }
      });
      
      // Create array of species with sightings count
      const speciesWithCounts = allSpecies.map(sp => ({
        ...sp,
        sightings: speciesSightingsMap.get(sp.id) || 0
      }));
      
      // Calculate totals from ALL species
      const totalSpecies = speciesWithCounts.length;
      const totalSightings = speciesWithCounts.reduce((sum, sp) => sum + sp.sightings, 0);
      
      // Get top 5 most sighted
      const topSpecies = [...speciesWithCounts]
        .sort((a, b) => b.sightings - a.sightings)
        .slice(0, 5)
        .map(sp => ({
          name: sp.commonName,
          count: sp.sightings,
          conservationStatus: sp.conservationStatus || 'Least Concern',
          lastObserved: new Date().toLocaleDateString()
        }));
      
      // Get top 5 rare & migratory birds
      const rareSpecies = speciesWithCounts
        .filter(sp => sp.status === 'Rare' || sp.status === 'Migratory')
        .sort((a, b) => b.sightings - a.sightings)
        .slice(0, 5)
        .map(sp => ({
          name: sp.commonName,
          count: sp.sightings,
          conservationStatus: sp.conservationStatus || 'Least Concern',
          status: sp.status,
          lastObserved: new Date().toLocaleDateString()
        }));
      
      // Monthly timeline (zero-filled 12-month buckets)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthMap = new Map<string, number>();
      months.forEach(m => monthMap.set(m, 0));
      
      allSightings.forEach(s => {
        const date = new Date(s.date);
        const month = months[date.getMonth()];
        monthMap.set(month, (monthMap.get(month) || 0) + 1);
      });
      
      const migrationData = months.map(month => ({
        month,
        count: monthMap.get(month) || 0
      }));
      
      // Seasonal data
      const seasonalMap = new Map<string, number>([
        ['Winter (Dec-Feb)', 0],
        ['Summer (Mar-May)', 0],
        ['Monsoon (Jun-Sep)', 0],
        ['Post-monsoon (Oct-Nov)', 0]
      ]);
      
      allSightings.forEach(s => {
        const date = new Date(s.date);
        const month = date.getMonth();
        if ([11, 0, 1].includes(month)) seasonalMap.set('Winter (Dec-Feb)', (seasonalMap.get('Winter (Dec-Feb)') || 0) + 1);
        else if ([2, 3, 4].includes(month)) seasonalMap.set('Summer (Mar-May)', (seasonalMap.get('Summer (Mar-May)') || 0) + 1);
        else if ([5, 6, 7, 8].includes(month)) seasonalMap.set('Monsoon (Jun-Sep)', (seasonalMap.get('Monsoon (Jun-Sep)') || 0) + 1);
        else seasonalMap.set('Post-monsoon (Oct-Nov)', (seasonalMap.get('Post-monsoon (Oct-Nov)') || 0) + 1);
      });
      
      const seasonalData = Array.from(seasonalMap.entries()).map(([season, count]) => ({ season, count }));
      
      return {
        totalSpecies,
        totalSightings,
        topSpecies,
        rareSpecies,
        migrationData,
        seasonalData
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return {
        totalSpecies: 0,
        totalSightings: 0,
        topSpecies: [],
        rareSpecies: [],
        migrationData: [],
        seasonalData: []
      };
    }
  }
}

export const storage = new DbStorage();
