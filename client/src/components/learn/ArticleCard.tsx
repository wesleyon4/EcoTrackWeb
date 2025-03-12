import { Article } from "../../shared/schema";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // Map category to color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "waste reduction":
        return "bg-primary";
      case "sustainable fashion":
        return "bg-secondary";
      case "energy efficiency":
        return "bg-accent-dark";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-32 bg-neutral-lightest relative">
        <img
          src={article.imageUrl || "https://via.placeholder.com/512x256"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-2 left-2 ${getCategoryColor(article.category)} text-white text-xs px-2 py-1 rounded`}>
          {article.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-neutral-dark mb-1">{article.title}</h3>
        <p className="text-neutral-medium text-sm mb-2">
          {article.content.substring(0, 60)}...
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-medium">{article.readTime} min read</span>
          <button className="text-primary hover:text-primary-dark text-xs font-semibold">
            Read Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
