import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for marker icons in React Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

// Temporary RecyclingCenter interface until schema import issue is fixed
interface RecyclingCenter {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  acceptedMaterials: string[];
  operatingHours: string;
  distance?: number;
}

interface RecyclingMapProps {
  centers: RecyclingCenter[];
  userLocation?: { lat: number; lng: number };
}

// Fix Leaflet default icon paths
const DefaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RecyclingMap = ({ centers, userLocation }: RecyclingMapProps) => {
  // Create custom icon using L.divIcon for better performance
  const customIcon = useMemo(() => {
    return new L.Icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerRetina,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }, []);

  // Default to NYC if no user location
  const defaultCenter = userLocation || { lat: 40.7128, lng: -74.0060 };
  
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* @ts-ignore - Ignoring type errors for react-leaflet components */}
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        {/* @ts-ignore - Ignoring type errors for react-leaflet components */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          /* @ts-ignore - Ignoring type errors for react-leaflet components */
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Recycling Centers Markers */}
        {centers.map((center) => (
          /* @ts-ignore - Ignoring type errors for react-leaflet components */
          <Marker 
            key={center.id}
            position={[center.latitude, center.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>{center.name}</strong>
                <p className="mt-1">{center.address}</p>
                <p className="mt-1 text-xs text-neutral-medium">{center.operatingHours}</p>
                {center.distance && (
                  <p className="mt-1 text-xs text-primary font-semibold">
                    {center.distance.toFixed(1)} miles away
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RecyclingMap;