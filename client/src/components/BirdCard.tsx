import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ruler, Weight, TreePine, Calendar } from "lucide-react";

export interface BirdCardProps {
  id: number;
  commonName: string;
  scientificName: string;
  tamilName: string;
  image: string;
  status: "Migratory" | "Resident" | "Rare";
  size: string;
  weight: string;
  habitat: string;
  season: string;
  arModelUrl?: string;
  onARView: () => void;
  onDetails: () => void;
}

const statusColors = {
  Migratory: "bg-amber-500 text-white hover:bg-amber-600",
  Resident: "bg-green-600 text-white hover:bg-green-700",
  Rare: "bg-red-500 text-white hover:bg-red-600",
};

export default function BirdCard({
  commonName,
  scientificName,
  tamilName,
  image,
  status,
  size,
  weight,
  habitat,
  season,
  arModelUrl,
  onARView,
  onDetails,
}: BirdCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-bird-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={commonName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-bird-${commonName.toLowerCase().replace(/\s+/g, '-')}`}
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${statusColors[status]} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-status-${status.toLowerCase()}`}>
            {status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-1" data-testid={`text-name-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>
          {commonName}
        </h3>
        <p className="text-sm italic text-muted-foreground mb-2" data-testid={`text-scientific-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>
          {scientificName}
        </p>
        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-tamil-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>
          {tamilName}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" data-testid="icon-size" />
            <span className="text-sm text-foreground" data-testid={`text-size-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>{size}</span>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-muted-foreground" data-testid="icon-weight" />
            <span className="text-sm text-foreground" data-testid={`text-weight-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>{weight}</span>
          </div>
          <div className="flex items-center gap-2">
            <TreePine className="h-4 w-4 text-muted-foreground" data-testid="icon-habitat" />
            <span className="text-sm text-foreground" data-testid={`text-habitat-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>{habitat}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" data-testid="icon-season" />
            <span className="text-sm text-foreground" data-testid={`text-season-${commonName.toLowerCase().replace(/\s+/g, '-')}`}>{season}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        {arModelUrl && (
          <Button
            className="flex-1"
            onClick={onARView}
            data-testid={`button-ar-view-${commonName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            AR View
          </Button>
        )}
        <Button
          variant="outline"
          className={arModelUrl ? "flex-1" : "w-full"}
          onClick={onDetails}
          data-testid={`button-details-${commonName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
