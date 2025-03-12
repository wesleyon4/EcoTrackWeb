/**
 * Product Data Management Hook
 * 
 * This hook provides a collection of custom hooks for interacting with product data.
 * It handles querying for products by various criteria, recording product scans,
 * and adding new products to the database.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";

// Product type definition (copied from schema.ts to avoid import errors)
// NOTE: To use the actual schema, you'll need to fix import paths in your project
// CONFIGURATION REQUIRED: Update this if your schema changes
interface Product {
  id: number;
  barcode: string;
  name: string;
  brand: string;
  carbonFootprint?: number;
  materials?: any;
  recyclability?: string;
  ecoScore?: string;
  ecoScoreValue?: number;
  imageUrl?: string;
  createdAt: Date;
}

/**
 * Main hook that provides access to all product-related data operations
 * @returns Collection of custom hooks for product data operations
 */
export const useProducts = () => {
  /**
   * Get a list of recently scanned products
   * Used on the home page to show recent activity
   * @returns Query result with an array of recently scanned products
   */
  const useRecentScans = () => {
    return useQuery<Product[]>({
      queryKey: ["/api/scans/recent"],
    });
  };

  /**
   * Get a specific product by its ID
   * Used on the product details page
   * @param id The product ID to retrieve
   * @returns Query result with the product data
   */
  const useProduct = (id: string) => {
    return useQuery<Product>({
      queryKey: [`/api/products/${id}`],
      enabled: !!id, // Only run the query if an ID is provided
    });
  };

  /**
   * Get a product by its barcode
   * Central to the scanning feature of the app
   * @param barcode The barcode to look up
   * @returns Query result with the product data
   */
  const useProductByBarcode = (barcode: string) => {
    return useQuery<Product>({
      queryKey: [`/api/products/barcode/${barcode}`],
      enabled: !!barcode, // Only run the query if a barcode is provided
    });
  };

  /**
   * Search for products by name, brand, or other attributes
   * Used for the search functionality in the app
   * @param query The search term
   * @returns Query result with an array of matching products
   */
  const useSearchProducts = (query: string) => {
    return useQuery<Product[]>({
      queryKey: [`/api/products/search?q=${encodeURIComponent(query)}`],
      enabled: !!query && query.length > 2, // Only run the query if it's at least 3 characters
    });
  };

  /**
   * Record a new product scan in the user's history
   * Called when a user successfully scans a product
   * @returns Mutation function to record a scan and associated state
   */
  const useRecordScan = () => {
    return useMutation({
      // Function that performs the API call
      mutationFn: async (productId: number) => {
        const response = await apiRequest("POST", "/api/scans", { productId });
        return response.json();
      },
      // After successful scan, update the recent scans list
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/scans/recent"] });
      },
    });
  };

  /**
   * Add a new product to the database
   * Used when a scanned product is not found and needs to be added manually
   * @returns Mutation function to add a product and associated state
   */
  const useAddProduct = () => {
    return useMutation({
      // Function that performs the API call
      mutationFn: async (product: Omit<Product, "id" | "createdAt">) => {
        const response = await apiRequest("POST", "/api/products", product);
        return response.json();
      },
      // After successful creation, update the products list
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      },
    });
  };

  // Return all the hooks as an object
  return {
    useRecentScans,
    useProduct,
    useProductByBarcode,
    useSearchProducts,
    useRecordScan,
    useAddProduct,
  };
};
