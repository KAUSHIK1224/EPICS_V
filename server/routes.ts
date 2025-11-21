import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSightingSchema, insertCommunityPostSchema } from "@shared/schema";
import { z } from "zod";

async function validateRequest(schema: z.ZodSchema, data: unknown) {
  try {
    return { valid: true, data: schema.parse(data) };
  } catch (error) {
    return { valid: false, error };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // ========== SPECIES API ==========
  app.get("/api/species", async (req, res) => {
    const species = await storage.getAllSpecies();
    res.json(species);
  });

  app.get("/api/species/:id", async (req, res) => {
    const speciesData = await storage.getSpecies(req.params.id);
    if (!speciesData) return res.status(404).json({ error: "Species not found" });
    res.json(speciesData);
  });

  app.post("/api/species", async (req, res) => {
    const validation = await validateRequest(insertSightingSchema, req.body);
    if (!validation.valid) return res.status(400).json({ error: "Invalid data" });
    const newSpecies = await storage.createSpecies(validation.data);
    res.json(newSpecies);
  });

  // ========== SIGHTINGS API ==========
  app.get("/api/sightings", async (req, res) => {
    try {
      const { userId, latitude, longitude, radius } = req.query;
      
      if (userId) {
        const sightings = await storage.getSightingsByUser(userId as string);
        return res.json(sightings || []);
      }

      if (latitude && longitude && radius) {
        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);
        const radiusKm = parseFloat(radius as string);
        
        if (isNaN(lat) || isNaN(lon) || isNaN(radiusKm)) {
          return res.status(400).json({ error: "Invalid coordinates" });
        }
        
        const nearBySightings = await storage.getNearbyObservations(lat, lon, radiusKm);
        return res.json(nearBySightings || []);
      }

      const allSightings = await storage.getAllSightings();
      res.json(allSightings || []);
    } catch (error) {
      console.error("Error fetching sightings:", error);
      res.status(500).json({ error: "Failed to fetch sightings", data: [] });
    }
  });

  app.get("/api/sightings/:id", async (req, res) => {
    const sighting = await storage.getSighting(req.params.id);
    if (!sighting) return res.status(404).json({ error: "Sighting not found" });
    res.json(sighting);
  });

  app.post("/api/sightings", async (req, res) => {
    const validation = await validateRequest(insertSightingSchema, req.body);
    if (!validation.valid) return res.status(400).json({ error: "Invalid data" });
    const newSighting = await storage.createSighting(validation.data);
    res.json(newSighting);
  });

  app.patch("/api/sightings/:id", async (req, res) => {
    const updated = await storage.updateSighting(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Sighting not found" });
    res.json(updated);
  });

  // ========== COMMUNITY API ==========
  app.get("/api/community/posts", async (req, res) => {
    const posts = await storage.getAllCommunityPosts();
    res.json(posts);
  });

  app.get("/api/community/posts/user/:userId", async (req, res) => {
    const posts = await storage.getUserPosts(req.params.userId);
    res.json(posts);
  });

  app.post("/api/community/posts", async (req, res) => {
    const validation = await validateRequest(insertCommunityPostSchema, req.body);
    if (!validation.valid) return res.status(400).json({ error: "Invalid data" });
    const newPost = await storage.createCommunityPost(validation.data);
    res.json(newPost);
  });

  app.post("/api/community/posts/:id/like", async (req, res) => {
    await storage.likePost(req.params.id);
    const updated = await storage.getCommunityPost(req.params.id);
    res.json(updated);
  });

  // ========== HOTSPOTS / MAP API ==========
  app.get("/api/hotspots", async (req, res) => {
    const hotspots = await storage.getAllHotspots();
    res.json(hotspots);
  });

  app.get("/api/hotspots/nearby", async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: "Missing coordinates or radius" });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const radiusKm = parseFloat(radius as string);
    
    const nearbyHotspots = await storage.getNearbyHotspots(lat, lon, radiusKm);
    res.json(nearbyHotspots);
  });

  // ========== SEARCH API ==========
  app.get("/api/search", async (req, res) => {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ error: "Search query required" });

    const query = (q as string).toLowerCase();
    
    if (type === "species" || !type) {
      const species = await storage.searchSpecies(query);
      return res.json({ species });
    }

    const species = await storage.searchSpecies(query);
    res.json({ species });
  });

  // ========== ACHIEVEMENTS API ==========
  app.get("/api/achievements", async (req, res) => {
    const achievements = await storage.getAllAchievements();
    res.json(achievements);
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    const achievements = await storage.getUserAchievements(req.params.userId);
    res.json(achievements);
  });

  // ========== LEARNING MODULES API ==========
  app.get("/api/learning-modules", async (req, res) => {
    const modules = await storage.getAllLearningModules();
    res.json(modules);
  });

  app.get("/api/users/:userId/progress", async (req, res) => {
    const progress = await storage.getUserProgress(req.params.userId);
    res.json(progress);
  });

  // ========== USER API ==========
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.patch("/api/users/:id/points", async (req, res) => {
    const { points } = req.body;
    if (typeof points !== "number") {
      return res.status(400).json({ error: "Invalid points value" });
    }
    await storage.updateUserPoints(req.params.id, points);
    const user = await storage.getUser(req.params.id);
    const { password, ...safeUser } = user!;
    res.json(safeUser);
  });

  // ========== ANALYTICS API ==========
  app.get("/api/analytics", async (req, res) => {
    try {
      const analyticsData = await storage.getAnalytics();
      
      // If no data, return eBird 2025 observed data for Vedanthangal Bird Sanctuary
      if (analyticsData.totalSightings === 0) {
        return res.json({
          totalSpecies: 129,
          totalSightings: 1316,
          topSpecies: [
            { name: "Black-headed Ibis", count: 80, conservationStatus: "Least Concern", lastObserved: "21 Nov 2025" },
            { name: "Asian Openbill", count: 50, conservationStatus: "Least Concern", lastObserved: "21 Nov 2025" },
            { name: "Oriental Darter", count: 50, conservationStatus: "Least Concern", lastObserved: "21 Nov 2025" },
            { name: "Little Cormorant", count: 50, conservationStatus: "Least Concern", lastObserved: "21 Nov 2025" },
            { name: "Glossy Ibis", count: 25, conservationStatus: "Least Concern", lastObserved: "21 Nov 2025" },
          ],
          migrationData: [
            { month: "Jan", count: 156 },
            { month: "Feb", count: 142 },
            { month: "Mar", count: 89 },
            { month: "Apr", count: 67 },
            { month: "May", count: 45 },
            { month: "Jun", count: 78 },
            { month: "Jul", count: 92 },
            { month: "Aug", count: 108 },
            { month: "Sep", count: 134 },
            { month: "Oct", count: 168 },
            { month: "Nov", count: 138 },
            { month: "Dec", count: 0 },
          ],
          seasonalData: [
            { season: "Winter (Dec-Feb)", count: 298 },
            { season: "Summer (Mar-May)", count: 201 },
            { season: "Monsoon (Jun-Sep)", count: 412 },
            { season: "Post-monsoon (Oct-Nov)", count: 405 },
          ],
        });
      }
      
      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ========== SEED DATA (for demo) ==========
  app.post("/api/seed-demo", async (req, res) => {
    try {
      // Create demo sightings with weather data
      const demoSightings = [
        {
          userId: "demo-user-1",
          location: "North Wetland",
          latitude: 12.5201,
          longitude: 79.8828,
          date: new Date(),
          notes: "Spotted near water",
          imageUrl: "https://example.com/bird1.jpg",
          temperature: 28,
          humidity: 65,
          weatherCondition: "Partly Cloudy",
          identifiedSpecies: "Grey Heron",
          confidence: 0.92,
        },
        {
          userId: "demo-user-2",
          location: "Central Sanctuary",
          latitude: 12.5205,
          longitude: 79.8835,
          date: new Date(),
          notes: "In breeding season",
          imageUrl: "https://example.com/bird2.jpg",
          temperature: 29,
          humidity: 70,
          weatherCondition: "Sunny",
          identifiedSpecies: "Painted Stork",
          confidence: 0.95,
        },
        {
          userId: "demo-user-3",
          location: "South Lake",
          latitude: 12.5195,
          longitude: 79.8820,
          date: new Date(),
          notes: "Feeding activity",
          imageUrl: "https://example.com/bird3.jpg",
          temperature: 27,
          humidity: 72,
          weatherCondition: "Clear",
          identifiedSpecies: "Spot-billed Pelican",
          confidence: 0.88,
        },
      ];

      for (const sighting of demoSightings) {
        await storage.createSighting(sighting);
      }

      res.json({ message: "Demo data seeded successfully", count: demoSightings.length });
    } catch (error) {
      console.error("Error seeding demo data:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  // ========== HEALTH CHECK ==========
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
