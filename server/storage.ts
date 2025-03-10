import { users, products, scans, articles, recyclingCenters, type User, type InsertUser, type Product, type InsertProduct, type Scan, type InsertScan, type Article, type InsertArticle, type RecyclingCenter, type InsertRecyclingCenter } from "@shared/schema";

// Interface defining all required storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Scan operations
  getScans(userId?: number): Promise<Scan[]>;
  getRecentScans(limit?: number): Promise<Product[]>;
  createScan(scan: InsertScan): Promise<Scan>;
  
  // Article operations
  getArticles(category?: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  
  // Recycling center operations
  getRecyclingCenters(lat: number, lng: number, material?: string, limit?: number): Promise<RecyclingCenter[]>;
  getRecyclingCenter(id: number): Promise<RecyclingCenter | undefined>;
  getAcceptedMaterials(): Promise<string[]>;
}

// Function to calculate distance between two coordinates (haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private scans: Map<number, Scan>;
  private articles: Map<number, Article>;
  private recyclingCenters: Map<number, RecyclingCenter>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private scanIdCounter: number;
  private articleIdCounter: number;
  private recyclingCenterIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.scans = new Map();
    this.articles = new Map();
    this.recyclingCenters = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.scanIdCounter = 1;
    this.articleIdCounter = 1;
    this.recyclingCenterIdCounter = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.barcode === barcode
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const createdAt = new Date();
    const product: Product = { ...insertProduct, id, createdAt };
    this.products.set(id, product);
    return product;
  }

  // Scan operations
  async getScans(userId?: number): Promise<Scan[]> {
    let scans = Array.from(this.scans.values());
    
    if (userId) {
      scans = scans.filter(scan => scan.userId === userId);
    }
    
    // Sort by most recent first
    return scans.sort((a, b) => 
      new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
    );
  }

  async getRecentScans(limit: number = 10): Promise<Product[]> {
    // Get all scans sorted by date (most recent first)
    const sortedScans = Array.from(this.scans.values()).sort(
      (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
    );
    
    // Get unique product IDs (to prevent duplicates)
    const uniqueProductIds = [...new Set(sortedScans.map(scan => scan.productId))];
    
    // Get corresponding products and limit results
    const recentProducts = uniqueProductIds
      .slice(0, limit)
      .map(id => this.products.get(id))
      .filter((product): product is Product => product !== undefined);
    
    return recentProducts;
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const id = this.scanIdCounter++;
    const scannedAt = new Date();
    const scan: Scan = { ...insertScan, id, scannedAt };
    this.scans.set(id, scan);
    return scan;
  }

  // Article operations
  async getArticles(category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (category && category !== "all") {
      articles = articles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort by most recent first
    return articles.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  // Recycling center operations
  async getRecyclingCenters(
    lat: number, 
    lng: number, 
    material?: string, 
    limit?: number
  ): Promise<RecyclingCenter[]> {
    let centers = Array.from(this.recyclingCenters.values());
    
    // Filter by accepted materials if specified
    if (material) {
      centers = centers.filter(center => 
        center.acceptedMaterials && 
        Array.isArray(center.acceptedMaterials) && 
        center.acceptedMaterials.some(m => 
          m.toLowerCase() === material.toLowerCase()
        )
      );
    }
    
    // Calculate distance for each center and add it to the result
    centers = centers.map(center => ({
      ...center,
      distance: calculateDistance(lat, lng, center.latitude, center.longitude)
    }));
    
    // Sort by proximity
    centers.sort((a, b) => 
      (a.distance || Infinity) - (b.distance || Infinity)
    );
    
    // Apply limit if specified
    if (limit && limit > 0) {
      centers = centers.slice(0, limit);
    }
    
    return centers;
  }

  async getRecyclingCenter(id: number): Promise<RecyclingCenter | undefined> {
    return this.recyclingCenters.get(id);
  }

  async getAcceptedMaterials(): Promise<string[]> {
    const allMaterials = Array.from(this.recyclingCenters.values())
      .flatMap(center => center.acceptedMaterials || []);
    
    // Return unique materials
    return [...new Set(allMaterials)];
  }

  // Initialize demo data
  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: this.userIdCounter++,
      username: "demo",
      password: "password123", // In a real app, this would be hashed
      email: "demo@example.com",
      preferences: {
        preferredCategories: ["Eco-friendly", "Organic"],
        dietaryPreferences: ["Vegetarian"],
        materialPreferences: ["Recycled", "Biodegradable"]
      },
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);

    // Create sample products
    const products: Product[] = [
      {
        id: this.productIdCounter++,
        barcode: "123456789012",
        name: "Organic Shampoo",
        brand: "EcoClean Naturals",
        carbonFootprint: 0.8,
        materials: ["Organic ingredients", "Recycled plastic"],
        recyclability: "Fully recyclable packaging",
        ecoScore: "A+",
        ecoScoreValue: 90,
        imageUrl: "https://images.unsplash.com/photo-1594056113573-f8faae868732?w=256&q=80",
        createdAt: new Date()
      },
      {
        id: this.productIdCounter++,
        barcode: "223456789012",
        name: "Coffee Beans",
        brand: "Sunrise Roasters",
        carbonFootprint: 4.2,
        materials: ["Arabica beans", "Compostable packaging"],
        recyclability: "Compostable bag",
        ecoScore: "B",
        ecoScoreValue: 65,
        imageUrl: "https://images.unsplash.com/photo-1604929796133-4b1429e7f205?w=256&q=80",
        createdAt: new Date()
      },
      {
        id: this.productIdCounter++,
        barcode: "323456789012",
        name: "Paper Towels",
        brand: "CleanWipe Basic",
        carbonFootprint: 5.8,
        materials: ["Virgin paper", "Plastic wrapping"],
        recyclability: "Partially recyclable",
        ecoScore: "D",
        ecoScoreValue: 25,
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=256&q=80",
        createdAt: new Date()
      },
      {
        id: this.productIdCounter++,
        barcode: "423456789012",
        name: "Bamboo Toothbrush",
        brand: "EcoSmile",
        carbonFootprint: 0.5,
        materials: ["Bamboo", "Plant-based bristles"],
        recyclability: "Fully compostable",
        ecoScore: "A",
        ecoScoreValue: 85,
        imageUrl: "https://images.unsplash.com/photo-1572035509382-0a6a2e9bfec7?w=256&q=80",
        createdAt: new Date()
      },
      {
        id: this.productIdCounter++,
        barcode: "523456789012",
        name: "Reusable Water Bottle",
        brand: "AquaEco",
        carbonFootprint: 12.3,
        materials: ["Stainless steel"],
        recyclability: "Fully recyclable",
        ecoScore: "B+",
        ecoScoreValue: 75,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=256&q=80",
        createdAt: new Date()
      }
    ];

    // Add products to storage
    products.forEach(product => {
      this.products.set(product.id, product);
    });

    // Create sample scans
    const scans: Scan[] = [
      {
        id: this.scanIdCounter++,
        userId: demoUser.id,
        productId: products[0].id,
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        id: this.scanIdCounter++,
        userId: demoUser.id,
        productId: products[1].id,
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        id: this.scanIdCounter++,
        userId: demoUser.id,
        productId: products[2].id,
        scannedAt: new Date() // Today
      }
    ];

    // Add scans to storage
    scans.forEach(scan => {
      this.scans.set(scan.id, scan);
    });

    // Create sample articles
    const articles: Article[] = [
      {
        id: this.articleIdCounter++,
        title: "5 Easy Ways to Reduce Plastic Waste",
        content: "Plastic pollution is one of the most pressing environmental issues of our time. Every year, millions of tons of plastic waste enter our oceans, harming wildlife and ecosystems. Here are five simple ways you can reduce your plastic footprint: 1. Use reusable shopping bags, 2. Carry a reusable water bottle, 3. Say no to plastic straws, 4. Choose products with minimal packaging, 5. Recycle properly.",
        category: "Waste Reduction",
        imageUrl: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=512&q=80",
        readTime: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
      },
      {
        id: this.articleIdCounter++,
        title: "Guide to Sustainable Clothing Brands",
        content: "Fast fashion has a devastating impact on the environment, from water pollution to textile waste. Fortunately, many brands are now focusing on sustainable and ethical practices. This guide highlights clothing companies that prioritize eco-friendly materials, fair labor practices, and durable designs that won't end up in a landfill after a few wears.",
        category: "Sustainable Fashion",
        imageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=512&q=80",
        readTime: 6,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
      },
      {
        id: this.articleIdCounter++,
        title: "Home Energy Saving Tips",
        content: "Reducing energy consumption at home is not only good for the planet but also for your wallet. Simple changes like switching to LED bulbs, properly insulating your home, using smart thermostats, and unplugging electronics when not in use can significantly lower your carbon footprint and energy bills.",
        category: "Energy Efficiency",
        imageUrl: "https://images.unsplash.com/photo-1584473457409-ce95a9c00def?w=512&q=80",
        readTime: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
      },
      {
        id: this.articleIdCounter++,
        title: "Understanding Food Miles and Local Eating",
        content: "Food miles refer to the distance food travels from where it's grown to where it's consumed. The farther food travels, the more fuel is used and the more greenhouse gases are emitted. By choosing locally grown and produced foods, you can reduce your carbon footprint and support your local economy.",
        category: "Sustainable Food",
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=512&q=80",
        readTime: 7,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        id: this.articleIdCounter++,
        title: "The Benefits of Composting",
        content: "Composting is nature's way of recycling organic matter into nutrient-rich soil. By composting food scraps and yard waste instead of sending them to landfills, you can reduce methane emissions, enrich your garden soil, and decrease the need for chemical fertilizers.",
        category: "Waste Reduction",
        imageUrl: "https://images.unsplash.com/photo-1580412893011-3bf11c3bf010?w=512&q=80",
        readTime: 4,
        createdAt: new Date() // Today
      }
    ];

    // Add articles to storage
    articles.forEach(article => {
      this.articles.set(article.id, article);
    });

    // Create sample recycling centers
    const recyclingCenters: RecyclingCenter[] = [
      {
        id: this.recyclingCenterIdCounter++,
        name: "EcoRecycle Center",
        address: "123 Green St, Anytown",
        latitude: 40.7128,
        longitude: -74.0060,
        acceptedMaterials: ["Paper", "Glass", "Plastic", "Metal"],
        operatingHours: "Mon-Sat: 8AM-6PM",
        distance: 0 // Will be calculated based on user location
      },
      {
        id: this.recyclingCenterIdCounter++,
        name: "City Recycling Facility",
        address: "456 Earth Ave, Anytown",
        latitude: 40.7282,
        longitude: -73.9940,
        acceptedMaterials: ["Electronics", "Metal", "Batteries", "Hazardous Waste"],
        operatingHours: "Mon-Fri: 9AM-5PM",
        distance: 0 // Will be calculated based on user location
      },
      {
        id: this.recyclingCenterIdCounter++,
        name: "Green Planet Recycling",
        address: "789 Eco Blvd, Anytown",
        latitude: 40.7000,
        longitude: -74.0200,
        acceptedMaterials: ["Paper", "Cardboard", "Plastic", "Textiles"],
        operatingHours: "Mon-Sun: 24 hours (drop-off)",
        distance: 0 // Will be calculated based on user location
      },
      {
        id: this.recyclingCenterIdCounter++,
        name: "Community Compost Center",
        address: "101 Garden Way, Anytown",
        latitude: 40.7300,
        longitude: -73.9800,
        acceptedMaterials: ["Food Waste", "Yard Waste", "Compostable Materials"],
        operatingHours: "Wed, Sat, Sun: 10AM-4PM",
        distance: 0 // Will be calculated based on user location
      }
    ];

    // Add recycling centers to storage
    recyclingCenters.forEach(center => {
      this.recyclingCenters.set(center.id, center);
    });
  }
}

export const storage = new MemStorage();
