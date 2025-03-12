import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";
import { Product } from "../../shared/schema";

export const useProducts = () => {
  // Get recent scans
  const useRecentScans = () => {
    return useQuery<Product[]>({
      queryKey: ["/api/scans/recent"],
    });
  };

  // Get product by ID
  const useProduct = (id: string) => {
    return useQuery<Product>({
      queryKey: [`/api/products/${id}`],
      enabled: !!id,
    });
  };

  // Get product by barcode
  const useProductByBarcode = (barcode: string) => {
    return useQuery<Product>({
      queryKey: [`/api/products/barcode/${barcode}`],
      enabled: !!barcode,
    });
  };

  // Search products
  const useSearchProducts = (query: string) => {
    return useQuery<Product[]>({
      queryKey: [`/api/products/search?q=${encodeURIComponent(query)}`],
      enabled: !!query && query.length > 2,
    });
  };

  // Record a product scan
  const useRecordScan = () => {
    return useMutation({
      mutationFn: async (productId: number) => {
        const response = await apiRequest("POST", "/api/scans", { productId });
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/scans/recent"] });
      },
    });
  };

  // Add product manually
  const useAddProduct = () => {
    return useMutation({
      mutationFn: async (product: Omit<Product, "id" | "createdAt">) => {
        const response = await apiRequest("POST", "/api/products", product);
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      },
    });
  };

  return {
    useRecentScans,
    useProduct,
    useProductByBarcode,
    useSearchProducts,
    useRecordScan,
    useAddProduct,
  };
};
