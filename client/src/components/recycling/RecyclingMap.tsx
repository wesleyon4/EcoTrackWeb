import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RecyclingCenter } from "../../shared/schema";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for marker icons in React Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

// Define the default icon
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RecyclingMapProps {
  centers: RecyclingCenter[];
  userLocation?: { lat: number; lng: number };
}

const RecyclingMap = ({ centers, userLocation }: RecyclingMapProps) => {
  useEffect(() => {
    // Fix delete default icon issue in leaflet
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: markerRetina,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  // Default to NYC if no user location
  const defaultCenter = userLocation || { lat: 40.7128, lng: -74.0060 };

  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Location Marker */}
      {userLocation && (
        <Marker 
          position={[userLocation.lat, userLocation.lng]}
          icon={defaultIcon}
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
        <Marker 
          key={center.id}
          position={[center.latitude, center.longitude]}
          icon={defaultIcon}
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
  );
};

export default RecyclingMap;