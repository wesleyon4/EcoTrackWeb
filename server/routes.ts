/**
 * API Routes Configuration
 * 
 * This file defines all the REST API endpoints for the Eco-Track-Web application.
 * It organizes routes into logical sections for users, authentication, products,
 * scans, articles, and recycling centers.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertProductSchema, insertScanSchema, insertArticleSchema, insertRecyclingCenterSchema } from "@shared/schema";

/**
 * Register all API routes with the Express application
 * @param app - Express application instance
 * @returns HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * USERS API ROUTES
   * Endpoints for user account management and profile information
   */
  
  /**
   * GET /api/users/me - Retrieve the currently authenticated user
   * Returns user data without the password field
   * In a production app, this would verify session/authentication tokens
   */
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

  /**
   * AUTHENTICATION API ROUTES
   * Endpoints for user registration, login, and logout
   */
  
  /**
   * POST /api/auth/register - Create a new user account
   * Validates input data using Zod schema
   * Prevents duplicate usernames
   * Returns the new user data without the password
   */
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate request data against the schema
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

  /**
   * POST /api/auth/login - Authenticate a user
   * Validates credentials and returns user data on success
   * In a production app, would create a session or JWT token
   */
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

  /**
   * POST /api/auth/logout - Log out the current user
   * In a production app, would invalidate session or token
   */
  app.post("/api/auth/logout", async (req, res) => {
    // This route would normally invalidate the session
    res.json({ message: "Logged out successfully" });
  });

  /**
   * PRODUCTS API ROUTES
   * Endpoints for product information and management
   */
  
  /**
   * GET /api/products - Retrieve all products
   * Returns an array of product objects
   */
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * GET /api/products/:id - Retrieve a product by ID
   * Returns a single product or 404 if not found
   */
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

  /**
   * GET /api/products/barcode/:barcode - Retrieve a product by barcode
   * Central to the scanning feature of the app
   * Returns a single product or 404 if not found
   */
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

  /**
   * GET /api/products/search - Search for products
   * Uses query parameter 'q' for search term
   * Returns an array of matching products
   */
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

  /**
   * POST /api/products - Create a new product
   * Validates input using product schema
   * Returns the created product
   */
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

  /**
   * SCANS API ROUTES
   * Endpoints for product scan history and recording
   */
  
  /**
   * GET /api/scans/recent - Get recently scanned products
   * Returns an array of product objects (not scan records)
   */
  app.get("/api/scans/recent", async (req, res) => {
    try {
      const recentScans = await storage.getRecentScans();
      res.json(recentScans);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * POST /api/scans - Record a new product scan
   * Validates input using scan schema
   * Returns the created scan record
   */
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

  /**
   * ARTICLES API ROUTES
   * Endpoints for educational content about sustainability
   */
  
  /**
   * GET /api/articles - Retrieve all educational articles
   * Returns an array of article objects
   */
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * GET /api/articles/:id - Retrieve an article by ID
   * Returns a single article or 404 if not found
   */
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

  /**
   * RECYCLING API ROUTES
   * Endpoints for recycling center information
   */
  
  /**
   * GET /api/recycling - Find recycling centers near location
   * Requires latitude and longitude
   * Optional filters for material type and result limit
   */
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

  /**
   * GET /api/recycling/:id - Retrieve a recycling center by ID
   * Returns a single recycling center or 404 if not found
   */
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

  /**
   * GET /api/recycling/materials - Get list of recyclable materials
   * Used for filtering recycling centers
   */
  app.get("/api/recycling/materials", async (req, res) => {
    try {
      const materials = await storage.getAcceptedMaterials();
      res.json(materials);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
