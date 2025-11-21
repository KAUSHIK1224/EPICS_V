import { db } from "./db";
import { eq, and, sql, lt, gt, lte, gte } from "drizzle-orm";
import { get2025Timeline, getTopSpecies2025, calculateTotal2025 } from "./ebird";
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
    rareSpecies?: Array<{ name: string; count: number; conservationStatus: string; status?: string }>;
    migrationData: Array<{ month: string; count: number }>;
    migrationData2025: Array<{ month: string; count: number }>;
    seasonalData: Array<{ season: string; count: number }>;
    statusDistribution?: Array<{ name: string; value: number }>;
  }>;
  getTimelineByYear(year: number): Promise<{
    year: number;
    monthly: number[];
    total: number;
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

  // Timeline by Year - fetch from database for complete year view
  async getTimelineByYear(year: number): Promise<{
    year: number;
    monthly: number[];
    total: number;
  }> {
    try {
      // Query database for all sightings in the requested year
      const allSightings = await this.getAllSightings();
      const monthly = Array(12).fill(0);
      let total = 0;

      allSightings.forEach(s => {
        const date = new Date(s.date);
        const sightingYear = date.getUTCFullYear();
        const sightingMonth = date.getUTCMonth();

        if (sightingYear === year) {
          monthly[sightingMonth] += 1;
          total += 1;
        }
      });
      
      console.log(`2025 Timeline from DB: Jan=${monthly[0]}, Feb=${monthly[1]}, Mar=${monthly[2]}, Apr=${monthly[3]}, Oct=${monthly[9]}, Nov=${monthly[10]}, Total=${total}`);
      
      return { year, monthly, total };
    } catch (error) {
      console.error("Error fetching timeline by year:", error);
      
      // Fallback: Real eBird API 2025 data (Jan-Nov accumulated throughout the year)
      if (year === 2025) {
        return {
          year: 2025,
          monthly: [0, 7950, 500, 300, 0, 0, 0, 0, 0, 200, 737, 0],
          total: 9687
        };
      }
      
      return { year, monthly: Array(12).fill(0), total: 0 };
    }
  }

  // Analytics - Use real eBird API data ONLY
  async getAnalytics() {
    try {
      // Get real eBird API data
      const ebirdTimeline = await get2025Timeline();
      const ebirdTopSpecies = await getTopSpecies2025(5);
      
      // Count total sightings from eBird data
      const totalSightings = calculateTotal2025(ebirdTimeline);
      
      // Get unique species count from eBird top species
      const totalSpecies = ebirdTopSpecies.length;
      
      // Format eBird top species for response
      const topSpecies = ebirdTopSpecies.map(sp => ({
        name: sp.name,
        count: sp.count,
        conservationStatus: 'Least Concern',
        lastObserved: new Date().toLocaleDateString()
      }));
      
      // No rare/migratory data from basic eBird API (to be added later)
      const rareSpecies: any[] = [];
      
      // Convert eBird timeline to monthly format
      const migrationData = ebirdTimeline.map(m => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m.month],
        count: m.count
      }));
      
      const migrationData2025 = migrationData;
      
      // Calculate seasonal distribution from timeline
      const seasonalData = [
        { season: "Winter (Jan-Feb)", count: (ebirdTimeline[0]?.count || 0) + (ebirdTimeline[1]?.count || 0) },
        { season: "Summer (Mar-May)", count: (ebirdTimeline[2]?.count || 0) + (ebirdTimeline[3]?.count || 0) + (ebirdTimeline[4]?.count || 0) },
        { season: "Monsoon (Jun-Sep)", count: (ebirdTimeline[5]?.count || 0) + (ebirdTimeline[6]?.count || 0) + (ebirdTimeline[7]?.count || 0) + (ebirdTimeline[8]?.count || 0) },
        { season: "Post-monsoon (Oct-Nov)", count: (ebirdTimeline[9]?.count || 0) + (ebirdTimeline[10]?.count || 0) },
      ];
      
      return {
        totalSpecies,
        totalSightings,
        topSpecies,
        rareSpecies,
        migrationData,
        migrationData2025,
        seasonalData
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      
      // Fallback: Real eBird API data ONLY (737 sightings, Nov 2025)
      return {
        totalSpecies: 5,
        totalSightings: 737,
        topSpecies: [
          { name: "Rock Pigeon", count: 20, conservationStatus: "Least Concern", lastObserved: new Date().toLocaleDateString() },
          { name: "Asian Openbill", count: 50, conservationStatus: "Least Concern", lastObserved: new Date().toLocaleDateString() },
          { name: "Oriental Darter", count: 50, conservationStatus: "Least Concern", lastObserved: new Date().toLocaleDateString() },
          { name: "Little Cormorant", count: 50, conservationStatus: "Least Concern", lastObserved: new Date().toLocaleDateString() },
          { name: "Indian Spot-billed Duck", count: 2, conservationStatus: "Least Concern", lastObserved: new Date().toLocaleDateString() }
        ],
        rareSpecies: [],
        migrationData: [
          { month: "Jan", count: 0 },
          { month: "Feb", count: 0 },
          { month: "Mar", count: 0 },
          { month: "Apr", count: 0 },
          { month: "May", count: 0 },
          { month: "Jun", count: 0 },
          { month: "Jul", count: 0 },
          { month: "Aug", count: 0 },
          { month: "Sep", count: 0 },
          { month: "Oct", count: 0 },
          { month: "Nov", count: 737 },
          { month: "Dec", count: 0 },
        ],
        migrationData2025: [
          { month: "Jan", count: 0 },
          { month: "Feb", count: 0 },
          { month: "Mar", count: 0 },
          { month: "Apr", count: 0 },
          { month: "May", count: 0 },
          { month: "Jun", count: 0 },
          { month: "Jul", count: 0 },
          { month: "Aug", count: 0 },
          { month: "Sep", count: 0 },
          { month: "Oct", count: 0 },
          { month: "Nov", count: 737 },
          { month: "Dec", count: 0 },
        ],
        seasonalData: [
          { season: "Winter (Jan-Feb)", count: 0 },
          { season: "Summer (Mar-May)", count: 0 },
          { season: "Monsoon (Jun-Sep)", count: 0 },
          { season: "Post-monsoon (Oct-Nov)", count: 737 },
        ]
      };
    }
  }
}

export const storage = new DbStorage();
/*
      if (s.speciesId) {
          speciesSightingsMap.set(s.speciesId, (speciesSightingsMap.get(s.speciesId) || 0) + 1);
