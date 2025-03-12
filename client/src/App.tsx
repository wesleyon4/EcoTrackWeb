/**
 * Main Application Component
 * 
 * This is the root component for the Eco-Track-Web application, providing the overall
 * structure and layout of the UI. It sets up routing, state providers, and the responsive
 * layout system including sidebar, main content area, and bottom navigation.
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Header from "./components/layout/Header";
import SideNavigation from "./components/layout/SideNavigation";
import BottomNavigation from "./components/layout/BottomNavigation";
import ScanButton from "./components/products/ScanButton";
import Home from "./pages/home";
import Scan from "./pages/scan";
import ProductDetails from "./pages/product-details";
import Recycling from "./pages/recycling";
import Learn from "./pages/learn";
import Profile from "./pages/profile";
import { useState } from "react";
import ScanModal from "./components/products/ScanModal";

/**
 * App Component
 * 
 * The main application container that defines the overall structure and routing.
 * Manages the global state for the barcode scanning modal which can be triggered
 * from multiple places in the app.
 */
function App() {
  // State for controlling the scan modal visibility
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  
  /**
   * Opens the barcode scanning modal
   * This is passed to various components that can trigger scanning
   */
  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
  };
  
  /**
   * Closes the barcode scanning modal
   * This is passed to the modal itself for close/cancel operations
   */
  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
  };

  return (
    // Wrap the entire application in the QueryClientProvider to enable data fetching
    <QueryClientProvider client={queryClient}>
      {/* Main application container with full height */}
      <div className="min-h-screen flex flex-col">
        {/* Global header/app bar */}
        <Header />
        
        {/* Main content area with sidebar */}
        <div className="flex-grow flex">
          {/* Sidebar navigation - hidden on mobile */}
          <div className="hidden md:block">
            <SideNavigation onScan={handleOpenScanModal} />
          </div>
          
          {/* Main content container - takes remaining width */}
          <main className="flex-grow md:ml-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              {/* Route configuration */}
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/scan" component={Scan} />
                <Route path="/product/:id" component={ProductDetails} />
                <Route path="/recycling" component={Recycling} />
                <Route path="/learn" component={Learn} />
                <Route path="/profile" component={Profile} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
        
        {/* Floating scan button - visible on all pages */}
        <ScanButton onScan={handleOpenScanModal} />
        
        {/* Bottom navigation bar - primary navigation on mobile */}
        <BottomNavigation />
        
        {/* Scan modal - shown when scanning is triggered */}
        <ScanModal isOpen={isScanModalOpen} onClose={handleCloseScanModal} />
      </div>
      
      {/* Toast notifications system */}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
