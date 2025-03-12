import { useLocation, Link } from "wouter";

interface SideNavigationProps {
  onScan: () => void;
}

const SideNavigation = ({ onScan }: SideNavigationProps) => {
  const [location] = useLocation();

  return (
    <nav className="hidden md:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-neutral-light overflow-y-auto">
      <div className="px-4 py-4">
        <div className="space-y-1">
          <Link href="/" className={`flex items-center py-2 px-4 w-full rounded-lg ${
                location === "/"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "hover:bg-neutral-lightest"
              }`}>
              <span className="material-icons mr-3">home</span>
              <span className="font-medium">Home</span>
          </Link>
          <Link href="/scan" className={`flex items-center py-2 px-4 w-full rounded-lg ${
                location === "/scan"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "hover:bg-neutral-lightest"
              }`}>
              <span className="material-icons mr-3">explore</span>
              <span className="font-medium">Discover Products</span>
          </Link>
          <Link href="/recycling" className={`flex items-center py-2 px-4 w-full rounded-lg ${
                location === "/recycling"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "hover:bg-neutral-lightest"
              }`}>
              <span className="material-icons mr-3">place</span>
              <span className="font-medium">Recycling Map</span>
          </Link>
          <Link href="/learn" className={`flex items-center py-2 px-4 w-full rounded-lg ${
                location === "/learn"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "hover:bg-neutral-lightest"
              }`}>
              <span className="material-icons mr-3">school</span>
              <span className="font-medium">Learn</span>
          </Link>
          <Link href="/profile" className={`flex items-center py-2 px-4 w-full rounded-lg ${
                location === "/profile"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "hover:bg-neutral-lightest"
              }`}>
              <span className="material-icons mr-3">person</span>
              <span className="font-medium">My Profile</span>
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-neutral-medium uppercase tracking-wider mb-2">
            MY LISTS
          </h3>
          <div className="space-y-1">
            <button className="flex items-center py-2 px-4 w-full rounded-lg hover:bg-neutral-lightest">
              <span className="material-icons mr-3 text-primary-light">favorite</span>
              <span>Favorites</span>
            </button>
            <button className="flex items-center py-2 px-4 w-full rounded-lg hover:bg-neutral-lightest">
              <span className="material-icons mr-3 text-accent">history</span>
              <span>Recently Viewed</span>
            </button>
            <button className="flex items-center py-2 px-4 w-full rounded-lg hover:bg-neutral-lightest">
              <span className="material-icons mr-3 text-secondary-light">shopping_cart</span>
              <span>Shopping List</span>
            </button>
          </div>
        </div>

        <div className="mt-8 px-4">
          <button
            onClick={onScan}
            className="scan-button flex items-center justify-center bg-primary hover:bg-primary-dark text-white py-3 px-6 w-full rounded-lg space-x-2"
          >
            <span className="material-icons">qr_code_scanner</span>
            <span className="font-medium">Scan Product</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation;
