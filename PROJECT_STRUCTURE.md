
# EcoTrack Web Application Structure

## 1. Frontend (React with TypeScript)
**Location:** `/client` directory

The frontend is built with React and TypeScript using modern UI components from Radix UI and styled with Tailwind CSS.

### Key Frontend Components:
- **Main Application:** `/client/src/App.tsx` - Main routing and layout
- **Pages:** `/client/src/pages/` - Individual page components
- **Components:** `/client/src/components/` - Reusable UI components
- **User Interface:** `/client/src/components/ui/` - Shadcn UI components
- **Barcode Scanning:** `/client/src/components/products/ScanModal.tsx` - Using jsQR library

### Barcode Scanning Implementation:
The application uses the **jsQR** library for barcode scanning functionality, imported dynamically in the ScanModal component. This allows users to scan product barcodes using their device camera.

## 2. Backend (Node.js with Express)
**Location:** `/server` directory

The backend is built with Node.js and Express, providing API endpoints for the frontend.

### Key Backend Files:
- **Server Entry:** `/server/index.ts` - Main Express server setup
- **API Routes:** `/server/routes.ts` - API endpoint definitions
- **Storage Interface:** `/server/storage.ts` - Database connection handling

## 3. Database (PostgreSQL with Drizzle ORM)
**Location:** `/shared/schema.ts` and database configuration files

The application uses PostgreSQL as the database with Drizzle ORM for type-safe database interactions.

### Database Configuration:
- **Schema Definition:** `/shared/schema.ts` - Database tables and relationships
- **ORM Configuration:** `/drizzle.config.ts` - Database connection settings

## 4. Shared Resources
**Location:** `/shared` directory

Code shared between frontend and backend, such as database schemas and type definitions.

## 5. Configuration Files
**Location:** Root directory

Various configuration files for the build process, deployment, and other settings:
- **Package Management:** `package.json` - Dependencies and scripts
- **TypeScript Config:** `tsconfig.json` - TypeScript compiler settings
- **Tailwind Config:** `tailwind.config.ts` - Styling configuration
- **Vite Config:** `vite.config.ts` - Build tool configuration
- **Deployment:** `.replit` - Replit-specific configuration

## API Integration
The application integrates with product databases through API calls, which are handled in the backend routes defined in `/server/routes.ts`. The frontend components make requests to these API endpoints to fetch or submit data.

## Running the Application
The application is configured to run on port 5000, serving both the API endpoints and the client application from the same server.
