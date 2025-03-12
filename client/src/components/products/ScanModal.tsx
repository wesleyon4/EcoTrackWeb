import { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { useLocation } from "wouter";

// Import jsQR dynamically to avoid issues with SSR
let jsQR: any = null;
import("jsqr").then((module) => {
  jsQR = module.default;
});

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScanModal = ({ isOpen, onClose }: ScanModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    let animationFrame: number;
    let stream: MediaStream | null = null;

    const startScanning = async () => {
      if (!isOpen || !jsQR) return;
      
      try {
        setScanning(true);
        
        // Access the user's camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        
        // Set up scanning loop
        const scanFrame = () => {
          if (!videoRef.current || !canvasRef.current || !jsQR) return;
          
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          
          if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
            
            if (code) {
              // Found a barcode, handle the result
              handleScannedBarcode(code.data);
              return; // Stop scanning once a code is found
            }
          }
          
          animationFrame = requestAnimationFrame(scanFrame);
        };
        
        scanFrame();
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast({
          title: "Camera Access Error",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        });
        setManualMode(true);
      }
    };

    if (isOpen) {
      startScanning();
    }

    return () => {
      // Clean up
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setScanning(false);
    };
  }, [isOpen, toast]);

  const handleScannedBarcode = (barcode: string) => {
    // Process the scanned barcode
    console.log("Scanned barcode:", barcode);
    
    toast({
      title: "Barcode Scanned",
      description: `Barcode: ${barcode}`,
    });
    
    // Navigate to product page or search results
    onClose();
    setLocation(`/product/${barcode}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleScannedBarcode(manualBarcode.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-semibold text-neutral-dark">
            Scan Product Barcode
          </DialogTitle>
        </DialogHeader>
        
        {manualMode ? (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="barcode" className="text-sm text-neutral-dark">
                Enter Barcode Manually
              </label>
              <input
                id="barcode"
                type="text"
                className="w-full p-2 border border-neutral-light rounded"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode number"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="h-64 bg-neutral-light rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                className="hidden"
              />
              {!scanning && (
                <div className="text-center">
                  <span className="material-icons text-4xl text-neutral-medium">qr_code_scanner</span>
                  <p className="text-neutral-medium mt-2">Initializing camera...</p>
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-medium mb-4 text-center">
              Position the barcode within the frame to scan
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => setManualMode(true)}
              >
                Enter Manually
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScanModal;
