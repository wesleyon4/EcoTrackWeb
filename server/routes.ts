import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertProductSchema, insertScanSchema, insertArticleSchema, insertRecyclingCenterSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users API Routes
  app.get("/api/users/me", async (req, res) => {
    try {
      // This route would normally check for a valid session
      // For demo purposes, we'll return a mock user if one exists
      const user = await storage.getUserByUsername("demo");
      
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Auth API Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(validatedData);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you would hash and compare passwords
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    // This route would normally invalidate the session
    res.json({ message: "Logged out successfully" });
  });

  // Products API Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/products/barcode/:barcode", async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const product = await storage.getProductByBarcode(barcode);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Scans API Routes
  app.get("/api/scans/recent", async (req, res) => {
    try {
      const recentScans = await storage.getRecentScans();
      res.json(recentScans);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/scans", async (req, res) => {
    try {
      const validatedData = insertScanSchema.parse(req.body);
      const scan = await storage.createScan(validatedData);
      res.status(201).json(scan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Articles API Routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Recycling API Routes
  app.get("/api/recycling", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const material = req.query.material as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Valid latitude and longitude required" });
      }
      
      const centers = await storage.getRecyclingCenters(lat, lng, material, limit);
      res.json(centers);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/recycling/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const center = await storage.getRecyclingCenter(id);
      if (!center) {
        return res.status(404).json({ message: "Recycling center not found" });
      }
      
      res.json(center);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/recycling/materials", async (req, res) => {
    try {
      const materials = await storage.getAcceptedMaterials();
      res.json(materials);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
