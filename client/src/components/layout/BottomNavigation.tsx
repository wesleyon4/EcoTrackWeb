import { useLocation, Link } from "wouter";

const BottomNavigation = () => {
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white border-t border-neutral-light fixed bottom-0 inset-x-0 z-40">
      <div className="flex justify-around">
        <Link href="/">
          <a
            className={`flex flex-col items-center py-2 px-4 w-1/5 ${
              location === "/" ? "text-primary" : "text-neutral-dark"
            }`}
          >
            <span className="material-icons text-lg">home</span>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/scan">
          <a
            className={`flex flex-col items-center py-2 px-4 w-1/5 ${
              location === "/scan" ? "text-primary" : "text-neutral-dark"
            }`}
          >
            <span className="material-icons text-lg">explore</span>
            <span className="text-xs mt-1">Discover</span>
          </a>
        </Link>
        <div className="w-1/5"></div> {/* Placeholder for scan button */}
        <Link href="/recycling">
          <a
            className={`flex flex-col items-center py-2 px-4 w-1/5 ${
              location === "/recycling" ? "text-primary" : "text-neutral-dark"
            }`}
          >
            <span className="material-icons text-lg">place</span>
            <span className="text-xs mt-1">Recycle</span>
          </a>
        </Link>
        <Link href="/profile">
          <a
            className={`flex flex-col items-center py-2 px-4 w-1/5 ${
              location === "/profile" ? "text-primary" : "text-neutral-dark"
            }`}
          >
            <span className="material-icons text-lg">person</span>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
