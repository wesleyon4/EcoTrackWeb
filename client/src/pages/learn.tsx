import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article } from "../../shared/schema";
import ArticleCard from "../components/learn/ArticleCard";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { 
    data: articles, 
    isLoading,
    error 
  } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  // Get unique categories from articles
  const categories = articles 
    ? ["all", ...new Set(articles.map(article => article.category))]
    : ["all"];

  // Filter articles based on search and category
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6">
      <h1 className="text-2xl font-heading font-bold mb-6">Sustainability Learning Center</h1>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 shadow-lg text-white">
        <div className="max-w-3xl">
          <h2 className="text-xl md:text-2xl font-heading font-bold mb-2">
            Deepen Your Eco Knowledge
          </h2>
          <p className="mb-4">
            Explore articles, guides, and tips to enhance your sustainability journey.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-neutral-medium text-sm">search</span>
          </div>
          <Input
            type="text"
            placeholder="Search articles and guides"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="overflow-x-auto flex w-full py-2">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="px-4"
            >
              {category === "all" ? "All Topics" : category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Articles</h2>
          <p className="mb-4">We encountered an error while loading the articles.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredArticles && filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-muted p-8 rounded-lg text-center">
          <span className="material-icons text-4xl text-muted-foreground mb-2">
            search_off
          </span>
          <h3 className="text-lg font-semibold mb-2">No Articles Found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any articles matching your search. Try different keywords or categories.
          </p>
          <Button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Learn;
