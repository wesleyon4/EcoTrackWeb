import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { RecyclingCenter } from "@shared/schema";

export const useRecycling = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Could not get your location. Please enable location services.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Get recycling centers
  const useRecyclingCenters = (materialType?: string) => {
    const queryKey = materialType 
      ? [`/api/recycling?lat=${userLocation?.lat}&lng=${userLocation?.lng}&material=${encodeURIComponent(materialType)}`]
      : [`/api/recycling?lat=${userLocation?.lat}&lng=${userLocation?.lng}`];
      
    return useQuery<RecyclingCenter[]>({
      queryKey,
      enabled: !!userLocation,
    });
  };

  // Get recycling center by ID
  const useRecyclingCenter = (id: string) => {
    return useQuery<RecyclingCenter>({
      queryKey: [`/api/recycling/${id}`],
      enabled: !!id,
    });
  };

  // Get accepted materials (for filter)
  const useAcceptedMaterials = () => {
    return useQuery<string[]>({
      queryKey: ["/api/recycling/materials"],
    });
  };

  return {
    userLocation,
    locationError,
    useRecyclingCenters,
    useRecyclingCenter,
    useAcceptedMaterials,
  };
};
