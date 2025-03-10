import { useEffect, useRef } from "react";
import { RecyclingCenter } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface RecyclingMapProps {
  centers: RecyclingCenter[];
  userLocation?: { lat: number; lng: number };
}

const RecyclingMap = ({ centers, userLocation }: RecyclingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Initialize leaflet map
    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;
        
        // Import CSS
        import("leaflet/dist/leaflet.css");
        
        // If map is already initialized, don't reinitialize
        if (mapInstanceRef.current) return;
        
        const defaultLocation = userLocation || { lat: 40.7128, lng: -74.0060 }; // Default to NYC
        
        // Create map
        const map = L.map(mapRef.current!).setView(
          [defaultLocation.lat, defaultLocation.lng],
          11
        );
        
        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        
        // Add user location marker if available
        if (userLocation) {
          L.marker([userLocation.lat, userLocation.lng], {
            icon: L.divIcon({
              html: `<span class="material-icons text-primary" style="font-size: 24px;">person_pin_circle</span>`,
              className: "",
              iconSize: [24, 24],
              iconAnchor: [12, 24],
            }),
          })
            .addTo(map)
            .bindPopup("Your Location")
            .openPopup();
        }
        
        // Save map instance
        mapInstanceRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
        toast({
          title: "Map Error",
          description: "Failed to load the recycling map.",
          variant: "destructive",
        });
      }
    };

    if (mapRef.current) {
      initMap();
    }

    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, toast]);

  // Update markers when centers change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current) return;
      
      try {
        const L = (await import("leaflet")).default;
        
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Add new markers
        centers.forEach(center => {
          const marker = L.marker([center.latitude, center.longitude], {
            icon: L.divIcon({
              html: `<span class="material-icons text-primary-light" style="font-size: 24px;">location_on</span>`,
              className: "",
              iconSize: [24, 24],
              iconAnchor: [12, 24],
            }),
          })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div>
                <strong>${center.name}</strong><br>
                ${center.address}<br>
                <small>${center.operatingHours || ""}</small>
              </div>
            `);
          
          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };

    if (mapInstanceRef.current && centers.length > 0) {
      updateMarkers();
    }
  }, [centers]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-neutral-light"
      style={{ minHeight: "300px" }}
    ></div>
  );
};

export default RecyclingMap;
