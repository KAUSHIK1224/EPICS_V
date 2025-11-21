import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Ruler, Weight, TreePine, Calendar, MapPin, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BirdCardProps } from "./BirdCard";

interface BirdDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bird: BirdCardProps;
  onARView?: () => void;
}

const statusColors = {
  Migratory: "bg-amber-500 text-white hover:bg-amber-600",
  Resident: "bg-green-600 text-white hover:bg-green-700",
  Rare: "bg-red-500 text-white hover:bg-red-600",
};

export default function BirdDetailModal({
  open,
  onOpenChange,
  bird,
  onARView,
}: BirdDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-bird-detail">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2" data-testid="text-detail-title">{bird.commonName}</DialogTitle>
              <p className="text-lg italic text-muted-foreground" data-testid="text-detail-scientific">{bird.scientificName}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-detail-tamil">{bird.tamilName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColors[bird.status]} no-default-hover-elevate no-default-active-elevate`} data-testid="badge-detail-status">
                {bird.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                data-testid="button-close-detail"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={bird.image}
                alt={bird.commonName}
                className="w-full h-full object-cover"
                data-testid="img-detail-main"
              />
            </div>
            
            {bird.arModelUrl && onARView && (
              <Button
                className="w-full"
                size="lg"
                onClick={onARView}
                data-testid="button-detail-ar-view"
              >
                <Camera className="mr-2 h-5 w-5" />
                Launch AR Experience
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3" data-testid="text-physical-title">Physical Characteristics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                  <Ruler className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Size</div>
                    <div className="font-medium" data-testid="text-detail-size">{bird.size}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                  <Weight className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Weight</div>
                    <div className="font-medium" data-testid="text-detail-weight">{bird.weight}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                  <TreePine className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Habitat</div>
                    <div className="font-medium" data-testid="text-detail-habitat">{bird.habitat}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Season</div>
                    <div className="font-medium" data-testid="text-detail-season">{bird.season}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3" data-testid="text-behavior-title">Habitat & Behavior</h3>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-detail-description">
                This species is commonly found in wetland habitats including marshes, lakes, and coastal areas. 
                They are known for their distinctive feeding behavior and seasonal migration patterns. During the 
                breeding season, they can be observed in large colonies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3" data-testid="text-location-title">Best Viewing Locations</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span data-testid="text-location-1">Main Observation Tower</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span data-testid="text-location-2">Wetland Trail Section 2</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span data-testid="text-location-3">East Lake Shore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
