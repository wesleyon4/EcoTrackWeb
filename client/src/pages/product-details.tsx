import { useParams, Link } from "wouter";
import { useProducts } from "../hooks/useProducts";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { useEffect } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const { useProductByBarcode, useRecordScan } = useProducts();
  
  const { 
    data: product, 
    isLoading,
    error,
    isError,
  } = useProductByBarcode(id);

  const { mutate: recordScan } = useRecordScan();

  // Record this scan for history
  useEffect(() => {
    if (product?.id) {
      recordScan(product.id);
    }
  }, [product?.id, recordScan]);

  if (isLoading) {
    return (
      <div className="py-6">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-64 w-64 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-full mb-6" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-6">
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-heading font-bold mb-4 text-destructive">
            Product Not Found
          </h1>
          <p className="mb-6">
            {error instanceof Error 
              ? error.message 
              : "We couldn't find this product in our database."}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/scan">
              <Button variant="outline">Scan Another Product</Button>
            </Link>
            <Button>Add This Product</Button>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to determine eco score info
  const getEcoScoreInfo = (score: string, value: number) => {
    if (value >= 80) return { color: "bg-status-success text-white", text: "Excellent", description: "This product has a minimal environmental impact." };
    if (value >= 60) return { color: "bg-status-success text-white", text: "Very Good", description: "This product has a low environmental impact." };
    if (value >= 40) return { color: "bg-status-warning text-white", text: "Good", description: "This product has a moderate environmental impact." };
    if (value >= 20) return { color: "bg-status-warning text-white", text: "Fair", description: "This product has a significant environmental impact." };
    return { color: "bg-status-error text-white", text: "Poor", description: "This product has a high environmental impact." };
  };

  const ecoScoreInfo = getEcoScoreInfo(product.ecoScore, product.ecoScoreValue);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-heading font-bold mb-4">{product.name}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-64 h-64 bg-neutral-lightest rounded-md flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl || "https://via.placeholder.com/256"}
              alt={product.name}
              className="object-contain h-full w-full"
            />
          </div>
          
          {/* Product Details */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-heading font-semibold">{product.name}</h2>
              <p className="text-neutral-medium">{product.brand}</p>
            </div>
            
            <div className="mb-4">
              <span className="text-sm text-neutral-medium">Barcode</span>
              <p className="font-mono">{product.barcode}</p>
            </div>
            
            {/* Eco Score */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">Eco Score</span>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${ecoScoreInfo.color}`}>
                  {product.ecoScore} - {ecoScoreInfo.text}
                </span>
              </div>
              <div className="eco-score-gradient mb-2">
                <div 
                  className={ecoScoreInfo.color.split(" ")[0]} 
                  style={{ width: `${product.ecoScoreValue}%`, height: "8px", borderRadius: "9999px" }}
                ></div>
              </div>
              <p className="text-sm text-neutral-medium">{ecoScoreInfo.description}</p>
            </div>
            
            {/* Environmental Impact */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Environmental Impact</h3>
              
              {product.carbonFootprint && (
                <div className="mb-2">
                  <span className="text-sm text-neutral-medium">Carbon Footprint</span>
                  <p>{product.carbonFootprint} kg CO2e</p>
                </div>
              )}
              
              <div className="mb-2">
                <span className="text-sm text-neutral-medium">Materials</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.materials && Array.isArray(product.materials) ? (
                    product.materials.map((material, index) => (
                      <Badge key={index} variant="outline">
                        {material}
                      </Badge>
                    ))
                  ) : (
                    <p>No material information available</p>
                  )}
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-sm text-neutral-medium">Recyclability</span>
                <p>{product.recyclability || "Information not available"}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button>
                <span className="material-icons mr-2">favorite_border</span>
                Save
              </Button>
              <Button variant="outline">
                <span className="material-icons mr-2">share</span>
                Share
              </Button>
              <Link href="/recycling">
                <Button variant="outline">
                  <span className="material-icons mr-2">delete</span>
                  Recycling Options
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alternative Products (TODO) */}
      <div className="mt-8">
        <h2 className="text-xl font-heading font-semibold text-neutral-dark mb-4">
          Eco-Friendly Alternatives
        </h2>
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-muted-foreground">
            Alternative product recommendations coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
