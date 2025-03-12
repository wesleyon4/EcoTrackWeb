/**
 * Main Server Entry Point
 * 
 * This is the main file that initializes and configures the Express server for the Eco-Track-Web application.
 * It sets up middleware, routes, and error handling for the application.
 */

import express, { Request, Response, NextFunction } from "express";
import { log as logMessage, setupVite, serveStatic } from "./vite";
import { registerRoutes } from "./routes";

// Configure logging with a custom source identifier
const log = (message: string) => logMessage(message, "express");

/**
 * Main application setup function
 * This async function initializes and configures the Express application
 */
async function main() {
  // Create a new Express application instance
  const app = express();
  
  // Middleware for parsing JSON request bodies
  // This allows the API to receive and process JSON data from clients
  app.use(express.json());
  
  // Register all API routes defined in routes.ts
  // This returns the HTTP server instance for later use with WebSockets or other features
  const server = await registerRoutes(app);
  
  // Set up Vite development server integration
  // This allows the frontend and backend to work together seamlessly during development
  await setupVite(app, server);

  // Serve static files and handle SPA routing
  // This ensures that client-side routes work correctly with browser refresh
  app.use(serveStatic);
  
  // Global error handler middleware
  // This catches any errors that occur during request processing
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  // Start the HTTP server
  // Use environment port or default to 5000
  // Bind to 0.0.0.0 to make the server accessible from all network interfaces
  const port = process.env.PORT || 5000;
  server.listen(Number(port), "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
}

// Execute the main function and handle any fatal errors
main().catch((err) => {
  console.error(err);
  process.exit(1);
});