import { RecyclingCenter } from "../../shared/schema";

interface RecyclingCenterCardProps {
  center: RecyclingCenter;
}

const RecyclingCenterCard = ({ center }: RecyclingCenterCardProps) => {
  const handleGetDirections = () => {
    // Open Google Maps directions in a new tab
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-start">
      <div className="bg-primary-light text-white p-2 rounded-md mr-3">
        <span className="material-icons">location_on</span>
      </div>
      <div>
        <h4 className="font-semibold text-neutral-dark">{center.name}</h4>
        <p className="text-sm text-neutral-medium">{center.address}</p>
        <div className="flex items-center mt-1 flex-wrap">
          {center.acceptedMaterials &&
            Array.isArray(center.acceptedMaterials) &&
            center.acceptedMaterials.slice(0, 3).map((material, index) => (
              <span
                key={index}
                className="text-xs bg-neutral-lightest rounded-full px-2 py-0.5 mr-1 mb-1"
              >
                {material}
              </span>
            ))}
          {center.acceptedMaterials && 
            Array.isArray(center.acceptedMaterials) && 
            center.acceptedMaterials.length > 3 && (
              <span className="text-xs text-neutral-medium">
                +{center.acceptedMaterials.length - 3} more
              </span>
            )}
        </div>
      </div>
      <div className="ml-auto text-right">
        <span className="text-xs text-neutral-medium">
          {center.distance ? `${center.distance.toFixed(1)} mi` : ""}
        </span>
        <button
          onClick={handleGetDirections}
          className="block mt-1 text-primary text-xs font-semibold"
        >
          Directions
        </button>
      </div>
    </div>
  );
};

export default RecyclingCenterCard;
