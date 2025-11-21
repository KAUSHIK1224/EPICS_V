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

  // ========== SEED API ==========
  app.post("/api/seed", async (req, res) => {
    try {
      const result = await storage.seedFullYear2025();
      res.json(result);
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  // ========== ANALYTICS API ==========
  app.get("/api/analytics", async (req, res) => {
    try {
      const analyticsData = await storage.getAnalytics();
      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/timeline", async (req, res) => {
    try {
      const year = parseInt(req.query.year as string) || 2025;
      const timeline = await storage.getTimelineByYear(year);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthly = months.map((month, idx) => ({ month, count: timeline.monthly[idx] || 0 }));
      res.json({ year: timeline.year, monthly, total: timeline.total });
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  // ========== SEED DATA (for demo) ==========
  app.post("/api/seed-demo", async (req, res) => {
    try {
      // Create demo sightings with 2025 dates throughout the year
      const demoSightings = [];
      const months = [
        { month: "January", date: new Date(2025, 0, 15) },
        { month: "January", date: new Date(2025, 0, 20) },
        { month: "February", date: new Date(2025, 1, 10) },
        { month: "February", date: new Date(2025, 1, 25) },
        { month: "March", date: new Date(2025, 2, 5) },
        { month: "April", date: new Date(2025, 3, 15) },
        { month: "May", date: new Date(2025, 4, 20) },
        { month: "August", date: new Date(2025, 7, 10) },
        { month: "October", date: new Date(2025, 9, 12) },
        { month: "November", date: new Date(2025, 10, 8) },
      ];

      const species = [
        { name: "Black-headed Ibis", location: "North Wetland" },
        { name: "Glossy Ibis", location: "Central Lake" },
        { name: "Little Egret", location: "South Wetland" },
        { name: "Painted Stork", location: "Central Sanctuary" },
        { name: "Spot-billed Pelican", location: "Main Lake" },
      ];

      let count = 0;
      for (const m of months) {
        for (const sp of species) {
          demoSightings.push({
            userId: `demo-user-${Math.random()}`,
            location: sp.location,
            latitude: 12.5201 + Math.random() * 0.01,
            longitude: 79.8828 + Math.random() * 0.01,
            date: new Date(m.date.getTime() + Math.random() * 86400000),
            notes: `Spotted ${sp.name} in ${m.month}`,
            imageUrl: "https://example.com/bird.jpg",
            temperature: 25 + Math.random() * 10,
            humidity: 60 + Math.random() * 20,
            weatherCondition: "Partly Cloudy",
            identifiedSpecies: sp.name,
            confidence: 0.85 + Math.random() * 0.15,
          });
          count++;
        }
      }

      for (const sighting of demoSightings) {
        await storage.createSighting(sighting);
      }

      res.json({ message: "Demo 2025 data seeded successfully", count });
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
