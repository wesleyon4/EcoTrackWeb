
# EcoTrack Configuration Guide

This guide shows exactly where to make configuration changes to get the app fully working. Follow these instructions to set up API keys, database connections, and other required settings.

## 1. Environment Variables (.env)

All sensitive keys and configuration should be stored in the `.env` file:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database_name"

# Google Maps API
GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"

# Recycling Facilities API (example: Earth911 or similar)
RECYCLING_API_KEY="your_recycling_api_key_here"
RECYCLING_API_URL="https://api.example.com/recycling"

# Authentication (for a production app, consider using a service like Auth0)
JWT_SECRET="your_jwt_secret_key_here"
```

## 2. Database Configuration (drizzle.config.ts)

Update the database configuration in `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
});
```

## 3. Server Configuration (server/index.ts)

Make sure your server configuration properly loads environment variables:

```typescript
import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);

// Server configuration
const port = process.env.PORT || 5000;

// Setup middleware and routes
// ...
```

## 4. Recycling Map Component (client/src/components/recycling/RecyclingMap.tsx)

Update the map component to use your Google Maps API key:

```tsx
import { useEffect, useRef } from "react";
import { RecyclingCenter } from "@shared/schema";
import { GOOGLE_MAPS_API_KEY } from "@/config";

// Google Maps API integration
export default function RecyclingMap({ 
  centers, 
  userLocation 
}: { 
  centers: RecyclingCenter[]; 
  userLocation: { lat: number; lng: number } 
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  
  useEffect(() => {
    // Load Google Maps script with API key
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    // Initialize map when script loads
    script.onload = initializeMap;
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  // More map configuration and functionality...
}
```

## 5. Config File (client/src/config.ts)

Create or update a config file to load environment variables for the client:

```typescript
// API keys and config settings for client
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
```

## 6. Vite Configuration (vite.config.ts)

Make sure your Vite configuration exposes environment variables to the client:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': 
      JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
    'import.meta.env.VITE_API_BASE_URL': 
      JSON.stringify(process.env.API_BASE_URL || ''),
  },
});
```

## 7. Recycling API Service (server/services/recyclingService.ts)

Create a service to handle recycling facility API requests:

```typescript
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const RECYCLING_API_KEY = process.env.RECYCLING_API_KEY;
const RECYCLING_API_URL = process.env.RECYCLING_API_URL;

export async function findRecyclingCenters(lat: number, lng: number, material?: string) {
  try {
    const response = await axios.get(`${RECYCLING_API_URL}/locations`, {
      params: {
        api_key: RECYCLING_API_KEY,
        latitude: lat,
        longitude: lng,
        material_id: material || '',
        distance: 25, // miles or km depending on API
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching recycling centers:', error);
    throw error;
  }
}

export async function getAcceptedMaterials() {
  try {
    const response = await axios.get(`${RECYCLING_API_URL}/materials`, {
      params: {
        api_key: RECYCLING_API_KEY,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching accepted materials:', error);
    throw error;
  }
}
```

## 8. Storage Configuration (server/storage.ts)

Update the database connection and setup:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import * as dotenv from 'dotenv';

dotenv.config();

// Database client setup
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

// Export database connection
export default db;
```

## 9. Auth Service (server/services/authService.ts)

Create an authentication service with proper JWT handling:

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

## List of Files That Need Configuration

1. `.env` - Add all environment variables
2. `drizzle.config.ts` - Update database connection
3. `server/index.ts` - Ensure environment variables are loaded
4. `client/src/components/recycling/RecyclingMap.tsx` - Add Google Maps integration
5. `client/src/config.ts` - Configure client environment variables
6. `vite.config.ts` - Ensure environment variables are exposed to client
7. `server/services/recyclingService.ts` - Create recycling API service
8. `server/storage.ts` - Configure database connection
9. `server/services/authService.ts` - Setup authentication

After making these changes, run the following commands to initialize and deploy your app:

```bash
# Install dependencies if needed
npm install

# Initialize database (if using migrations)
npx drizzle-kit push

# Start the development server
npm run dev
```
