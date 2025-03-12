import { useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search for:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <svg
              className="h-8 w-auto text-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3.375c-4.8 0-8.625 3.825-8.625 8.625s3.825 8.625 8.625 8.625 8.625-3.825 8.625-8.625S16.8 3.375 12 3.375z" />
              <path
                fill="#F5F7F2"
                d="M18 10.5c-0.4-0.4-1.1-0.4-1.5 0L12 14.1 7.5 10.5c-0.4-0.4-1.1-0.4-1.5 0s-0.4 1.1 0 1.5l5 4.5c0.4 0.4 1.1 0.4 1.5 0l5-4.5c0.5-0.4 0.5-1.1 0.1-1.5z"
              />
              <path
                fill="#F5F7F2"
                d="M16.5 7.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5S9.5 3 12 3s4.5 2 4.5 4.5z"
              />
            </svg>
            <span className="ml-2 text-xl font-heading font-bold text-neutral-dark">
              EcoTrack
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-medium" />
              </div>
              <Input
                type="text"
                placeholder="Search products or articles..."
                className="pl-10 pr-4 py-2 border border-neutral-light rounded-full bg-neutral-lightest"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button className="text-neutral-dark hover:text-primary transition-colors">
            <span className="material-icons">notifications_none</span>
          </button>
          <button className="bg-neutral-lightest p-1 rounded-full">
            <img
              className="h-8 w-8 rounded-full"
              src="https://via.placeholder.com/32"
              alt="User profile"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
