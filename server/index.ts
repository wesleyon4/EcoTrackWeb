import express, { Request, Response, NextFunction } from "express";
import { log as logMessage, setupVite, serveStatic } from "./vite";
import { registerRoutes } from "./routes";

const log = (message: string) => logMessage(message, "express");

async function main() {
  const app = express();
  
  // Middleware for parsing JSON
  app.use(express.json());
  
  // Register API routes
  const server = await registerRoutes(app);
  
  // Set up Vite (for development)
  await setupVite(app, server);

  // Fallback for SPA routing
  app.use(serveStatic);
  
  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  // Start server
  const port = process.env.PORT || 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});