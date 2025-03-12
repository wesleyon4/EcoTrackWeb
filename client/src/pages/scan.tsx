import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useProducts } from "../hooks/useProducts";
import { useScan } from "../hooks/useScan";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ProductCard from "../components/products/ProductCard";
import { Product } from "../../shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";

const Scan = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { scanBarcode } = useScan();
  const { useSearchProducts, useRecentScans } = useProducts();
  const { toast } = useToast();

  const { 
    data: searchResults, 
    isLoading: isSearching,
    error: searchError,
  } = useSearchProducts(searchQuery);

  const { 
    data: recentScans, 
    isLoading: isLoadingScans,
  } = useRecentScans();

  // Handle manual barcode submission
  const handleManualBarcodeScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const product = await scanBarcode(searchQuery);
      if (product) {
        navigate(`/product/${product.barcode}`);
      } else {
        toast({
          title: "Product Not Found",
          description: "We couldn't find this product in our database. Would you like to add it?",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scanning barcode:", error);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-heading font-bold mb-6">Discover Products</h1>

      <Tabs defaultValue="scan" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scan Barcode</TabsTrigger>
          <TabsTrigger value="search">Search Products</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Scan Product Barcode</h2>
            <p className="text-neutral-medium mb-6">
              Enter a barcode manually to look up product information
            </p>

            <form onSubmit={handleManualBarcodeScan} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter barcode number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                <span className="material-icons mr-2">search</span>
                Look Up Product
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="mb-4 text-neutral-medium">Or use the camera to scan</p>
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={() => {
                  // Open camera scanner
                  document.dispatchEvent(new CustomEvent('open-scan-modal'));
                }}
              >
                <span className="material-icons mr-2">photo_camera</span>
                Open Camera Scanner
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Search Products</h2>
            <form className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-neutral-medium text-sm">search</span>
                </div>
                <Input
                  type="text"
                  placeholder="Search by product name or brand"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </form>

            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-neutral-medium">Searching products...</p>
              </div>
            ) : searchError ? (
              <div className="text-center py-8 text-destructive">
                <p>Error searching products. Please try again.</p>
              </div>
            ) : searchQuery && searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8">
                <p className="text-neutral-medium">No products found. Try a different search term.</p>
              </div>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Scans Section */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-neutral-dark mb-4">
          Recent Scans
        </h2>
        
        {isLoadingScans ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-neutral-medium">Loading recent scans...</p>
          </div>
        ) : recentScans && recentScans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentScans.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-muted p-8 rounded-lg text-center">
            <span className="material-icons text-4xl text-muted-foreground mb-2">
              history
            </span>
            <h3 className="text-lg font-semibold mb-2">No Recent Scans</h3>
            <p className="text-muted-foreground mb-4">
              Start scanning products to see your history here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
