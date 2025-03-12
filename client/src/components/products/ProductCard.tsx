import { Link } from "wouter";
import { Product } from "../../shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Map eco score to corresponding status color and text
  const getEcoScoreInfo = (score: string, value: number) => {
    if (value >= 80) return { color: "bg-status-success", text: "Excellent" };
    if (value >= 60) return { color: "bg-status-success", text: "Very Good" };
    if (value >= 40) return { color: "bg-status-warning", text: "Good" };
    if (value >= 20) return { color: "bg-status-warning", text: "Fair" };
    return { color: "bg-status-error", text: "Poor" };
  };

  const ecoScoreInfo = getEcoScoreInfo(product.ecoScore, product.ecoScoreValue);

  return (
    <Link href={`/product/${product.barcode}`}>
      <a className="bg-white rounded-lg shadow-md p-4 min-w-[250px] max-w-[250px] flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="w-16 h-16 bg-neutral-lightest rounded-md flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl || "https://via.placeholder.com/64"}
              alt={product.name}
              className="object-cover h-full w-full"
            />
          </div>
          <div className={`${ecoScoreInfo.color} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
            {product.ecoScore}
          </div>
        </div>
        <h3 className="font-semibold text-neutral-dark mb-1">{product.name}</h3>
        <p className="text-neutral-medium text-sm mb-3">{product.brand}</p>
        <div className="mt-auto">
          <div className="mb-1 flex justify-between items-center">
            <span className="text-xs text-neutral-medium">Eco Score</span>
            <span className={`text-xs font-semibold ${
              product.ecoScoreValue >= 60 
                ? "text-status-success" 
                : product.ecoScoreValue >= 40 
                  ? "text-status-warning" 
                  : "text-status-error"
            }`}>
              {ecoScoreInfo.text}
            </span>
          </div>
          <div className="eco-score-gradient">
            <div 
              className={`${ecoScoreInfo.color} h-full rounded-full`} 
              style={{ width: `${product.ecoScoreValue}%` }}
            ></div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
