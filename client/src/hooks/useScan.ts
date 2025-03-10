import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@shared/schema";

export const useScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const scanBarcode = async (barcode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest("GET", `/api/products/barcode/${barcode}`);
      const data = await response.json();
      
      setScannedProduct(data);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan barcode");
      toast({
        title: "Scan Error",
        description: err instanceof Error ? err.message : "Failed to scan barcode",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return {
    isScanning,
    scannedProduct,
    isLoading,
    error,
    scanBarcode,
    startScanning,
    stopScanning,
  };
};
