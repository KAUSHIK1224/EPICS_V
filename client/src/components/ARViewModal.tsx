import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Info, Camera } from "lucide-react";
import { useState } from "react";

interface ARViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birdName: string;
  arModelUrl: string;
}

export default function ARViewModal({
  open,
  onOpenChange,
  birdName,
  arModelUrl,
}: ARViewModalProps) {
  const [showInfo, setShowInfo] = useState(false);

  const handleScreenshot = () => {
    console.log('Screenshot captured');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0" data-testid="modal-ar-view">
        <div className="relative w-full h-full flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle data-testid="text-ar-title">AR View: {birdName}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                data-testid="button-close-ar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 bg-muted flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2" data-testid="text-ar-url">AR Model URL:</p>
                <p className="text-sm font-mono bg-background px-4 py-2 rounded-md" data-testid="text-ar-model-url">
                  {arModelUrl}
                </p>
                <p className="text-xs text-muted-foreground mt-4" data-testid="text-ar-instruction">
                  This is where the AR viewer would be embedded
                </p>
              </div>
            </div>

            {showInfo && (
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-md rounded-lg p-4 border" data-testid="card-ar-info">
                <h4 className="font-semibold mb-2">AR Controls</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pinch to zoom in/out</li>
                  <li>• Drag to rotate the model</li>
                  <li>• Double tap to reset view</li>
                </ul>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowInfo(!showInfo)}
              data-testid="button-ar-info"
            >
              <Info className="mr-2 h-4 w-4" />
              {showInfo ? 'Hide' : 'Show'} Info
            </Button>
            <Button
              variant="outline"
              onClick={handleScreenshot}
              data-testid="button-ar-screenshot"
            >
              <Camera className="mr-2 h-4 w-4" />
              Screenshot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
