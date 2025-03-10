import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import SideNavigation from "@/components/layout/SideNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ScanButton from "@/components/products/ScanButton";
import Home from "@/pages/home";
import Scan from "@/pages/scan";
import ProductDetails from "@/pages/product-details";
import Recycling from "@/pages/recycling";
import Learn from "@/pages/learn";
import Profile from "@/pages/profile";
import { useState } from "react";
import ScanModal from "./components/products/ScanModal";

function App() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  
  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
  };
  
  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex">
          <div className="hidden md:block">
            <SideNavigation onScan={handleOpenScanModal} />
          </div>
          <main className="flex-grow md:ml-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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
        <ScanButton onScan={handleOpenScanModal} />
        <BottomNavigation />
        <ScanModal isOpen={isScanModalOpen} onClose={handleCloseScanModal} />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
