import { useState, useEffect } from "react";
import { useRecycling } from "../hooks/useRecycling";
import RecyclingMap from "../components/recycling/RecyclingMap";
import RecyclingCenterCard from "../components/recycling/RecyclingCenterCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";

const Recycling = () => {
  const { userLocation, locationError, useRecyclingCenters, useAcceptedMaterials } = useRecycling();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [searchRadius, setSearchRadius] = useState<number>(10);

  const {
    data: recyclingCenters,
    isLoading: isLoadingCenters,
    refetch,
  } = useRecyclingCenters(selectedMaterial);

  const {
    data: acceptedMaterials,
    isLoading: isLoadingMaterials,
  } = useAcceptedMaterials();

  // Filter centers based on search query
  const filteredCenters = recyclingCenters?.filter(center => 
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Request location permission if needed
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          window.location.reload();
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-heading font-bold mb-6">Recycling Centers</h1>

      {locationError ? (
        <div className="bg-destructive/10 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">Location Access Required</h2>
          <p className="mb-4">{locationError}</p>
          <Button onClick={requestLocationPermission}>
            Enable Location Services
          </Button>
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-64 sm:h-96 bg-neutral-lightest">
          {userLocation ? (
            <RecyclingMap
              centers={filteredCenters || []}
              userLocation={userLocation}
            />
          ) : (
            <div className="w-full h-full bg-neutral-light flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons text-4xl text-neutral-medium">
                  map
                </span>
                <p className="text-neutral-medium mt-2">
                  Loading map...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-neutral-medium text-sm">search</span>
          </div>
          <Input
            type="text"
            placeholder="Search by name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Material filter */}
        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Materials</SelectItem>
            {isLoadingMaterials ? (
              <SelectItem value="" disabled>
                Loading...
              </SelectItem>
            ) : (
              acceptedMaterials?.map((material) => (
                <SelectItem key={material} value={material}>
                  {material}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Radius filter */}
        <Select 
          value={searchRadius.toString()} 
          onValueChange={(value) => setSearchRadius(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Search radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Within 5 miles</SelectItem>
            <SelectItem value="10">Within 10 miles</SelectItem>
            <SelectItem value="25">Within 25 miles</SelectItem>
            <SelectItem value="50">Within 50 miles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Recycling Centers</h2>

        {isLoadingCenters ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start pb-4 border-b border-neutral-light">
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
        ) : filteredCenters && filteredCenters.length > 0 ? (
          <div className="space-y-4">
            {filteredCenters.map((center) => (
              <div key={center.id} className="pb-4 border-b border-neutral-light last:border-0">
                <RecyclingCenterCard center={center} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <span className="material-icons text-4xl text-neutral-medium mb-2">
              info
            </span>
            <h3 className="text-lg font-semibold mb-2">No Recycling Centers Found</h3>
            <p className="text-neutral-medium mb-4">
              Try adjusting your filters or search terms.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedMaterial("");
              refetch();
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recycling;
