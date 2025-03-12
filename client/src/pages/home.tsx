import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { Article, Product, RecyclingCenter } from "../../shared/schema";
import ProductCard from "../components/products/ProductCard";
import ArticleCard from "../components/learn/ArticleCard";
import RecyclingCenterCard from "../components/recycling/RecyclingCenterCard";
import RecyclingMap from "../components/recycling/RecyclingMap";
import { useRecycling } from "../hooks/useRecycling";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "../components/ui/skeleton";

const Home = () => {
  const { useRecentScans } = useProducts();
  const { userLocation } = useRecycling();
  
  const { 
    data: recentScans, 
    isLoading: isLoadingScans,
    error: scanError 
  } = useRecentScans();
  
  const { 
    data: articles, 
    isLoading: isLoadingArticles 
  } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });
  
  const { 
    data: recyclingCenters, 
    isLoading: isLoadingCenters 
  } = useQuery<RecyclingCenter[]>({
    queryKey: [`/api/recycling?lat=${userLocation?.lat}&lng=${userLocation?.lng}&limit=2`],
    enabled: !!userLocation,
  });

  return (
    <section className="py-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-dark to-secondary rounded-xl p-6 mb-8 shadow-lg text-white">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
            Make sustainable choices simple
          </h1>
          <p className="mb-4">
            Scan products, discover their impact, and find eco-friendly alternatives.
          </p>
          <Link href="/scan">
            <Button className="bg-accent hover:bg-accent-dark text-neutral-dark font-semibold py-2 px-6 rounded-full transition-colors flex items-center">
              <span className="material-icons mr-2">qr_code_scanner</span>
              <span>Start Scanning</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-neutral-dark">
            Recent Scans
          </h2>
          <Link href="/scan">
            <a className="text-primary text-sm font-semibold">View All</a>
          </Link>
        </div>

        {isLoadingScans ? (
          <div className="flex overflow-x-auto gap-4 pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[250px] max-w-[250px]">
                <Skeleton className="h-16 w-16 rounded-md mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-2 w-full mb-2" />
              </div>
            ))}
          </div>
        ) : scanError ? (
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            Failed to load recent scans
          </div>
        ) : recentScans && recentScans.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-4">
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
            <Link href="/scan">
              <Button>Scan a Product</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Sustainability Tips */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-neutral-dark">
            Sustainability Tips
          </h2>
          <Link href="/learn">
            <a className="text-primary text-sm font-semibold">View All</a>
          </Link>
        </div>

        {isLoadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-muted p-8 rounded-lg text-center">
            <span className="material-icons text-4xl text-muted-foreground mb-2">
              article
            </span>
            <h3 className="text-lg font-semibold mb-2">No Articles Found</h3>
            <p className="text-muted-foreground">
              Check back soon for sustainability tips and articles.
            </p>
          </div>
        )}
      </div>

      {/* Local Recycling */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold text-neutral-dark">
            Local Recycling Centers
          </h2>
          <Link href="/recycling">
            <a className="text-primary text-sm font-semibold">View Map</a>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 sm:h-64 bg-neutral-lightest">
            {userLocation ? (
              <RecyclingMap
                centers={recyclingCenters || []}
                userLocation={userLocation}
              />
            ) : (
              <div className="w-full h-full bg-neutral-light flex items-center justify-center">
                <div className="text-center">
                  <span className="material-icons text-4xl text-neutral-medium">
                    map
                  </span>
                  <p className="text-neutral-medium mt-2">
                    Please enable location services to see nearby recycling centers
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-neutral-dark mb-4">
              Nearby Recycling Centers
            </h3>

            {isLoadingCenters ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-10 w-10 rounded-md mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-3/4 mb-2" />
                      <div className="flex">
                        <Skeleton className="h-3 w-16 mr-1" />
                        <Skeleton className="h-3 w-16 mr-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recyclingCenters && recyclingCenters.length > 0 ? (
              <div className="space-y-3">
                {recyclingCenters.map((center) => (
                  <RecyclingCenterCard key={center.id} center={center} />
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-neutral-medium">
                  No recycling centers found nearby. Try expanding your search area.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
