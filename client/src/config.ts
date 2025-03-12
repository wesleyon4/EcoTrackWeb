/**
 * Application Configuration
 * 
 * This file contains environment variables and configuration settings 
 * that can be used throughout the client-side application.
 * 
 * For the application to work correctly, you will need to:
 * 1. Create a .env file at the root of the project
 * 2. Add the necessary environment variables as specified in .env.example
 * 
 * IMPORTANT: The VITE_ prefix is required for environment variables
 * to be exposed to the client-side code.
 */

// API Base URL for all requests
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Google Maps API Key for the map component
// CONFIGURATION REQUIRED: You must provide a valid Google Maps API key
// in your .env file as VITE_GOOGLE_MAPS_API_KEY
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

// Default location (used when user location is not available)
export const DEFAULT_LOCATION = {
  lat: 37.7749, // San Francisco
  lng: -122.4194
};

// Maximum number of recycling centers to show by default
export const MAX_RECYCLING_CENTERS = 10;

// Configuration for barcode scanning
export const BARCODE_SCAN_CONFIG = {
  // How often to attempt to scan barcodes from video feed (ms)
  scanInterval: 100,
  
  // Camera options
  camera: {
    facingMode: "environment", // Use back camera when available
    aspectRatio: 1
  }
};