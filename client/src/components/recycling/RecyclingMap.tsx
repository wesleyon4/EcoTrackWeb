
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RecyclingCenter } from "@shared/schema";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RecyclingMapProps {
  centers: RecyclingCenter[];
  userLocation: {
    lat: number;
    lng: number;
  };
}

const RecyclingMap = ({ centers, userLocation }: RecyclingMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(
      [userLocation.lat, userLocation.lng],
      12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white;"></div>`,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();

    // Store map reference
    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation]);

  // Add recycling center markers when centers data is available
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Re-add user location
    const userIcon = L.divIcon({
      html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white;"></div>`,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup("Your Location");

    // Add recycling center markers
    centers.forEach((center) => {
      const recycleIcon = L.divIcon({
        html: `<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 12px; font-weight: bold;">♻️</span>
              </div>`,
        className: 'recycle-location-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([center.lat, center.lng], { icon: recycleIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div>
            <strong>${center.name}</strong>
            <p>${center.address}</p>
            <p>Materials: ${center.acceptedMaterials.join(", ")}</p>
          </div>
        `);
    });

    // Adjust view to fit all markers if there are recycling centers
    if (centers.length > 0) {
      const allPoints = [
        [userLocation.lat, userLocation.lng],
        ...centers.map(center => [center.lat, center.lng])
      ] as [number, number][];
      
      if (allPoints.length > 1) {
        mapRef.current.fitBounds(L.latLngBounds(allPoints));
      }
    }
  }, [centers, userLocation]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ width: "100%", height: "100%" }}
      className="leaflet-map-container"
    />
  );
};

export default RecyclingMap;
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { RecyclingCenter } from "../../../shared/schema";

// Map container style
const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};

// Default center location if user location not available
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco as default
};

interface RecyclingMapProps {
  userLocation?: { lat: number; lng: number };
  centers?: RecyclingCenter[];
}

const RecyclingMap: React.FC<RecyclingMapProps> = ({ userLocation, centers = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const center = userLocation && userLocation.lat && userLocation.lng
    ? userLocation
    : defaultCenter;

  if (!isLoaded) return <div className="bg-neutral-lightest rounded h-[300px] flex items-center justify-center">Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      {/* User location marker */}
      {userLocation && userLocation.lat && userLocation.lng && (
        <Marker
          position={userLocation}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      )}
      
      {/* Recycling centers markers */}
      {centers.map((center) => (
        <Marker
          key={center.id}
          position={{ lat: center.lat, lng: center.lng }}
          title={center.name}
        />
      ))}
    </GoogleMap>
  );
};

export default RecyclingMap;
