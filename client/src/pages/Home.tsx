import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BirdCard, { BirdCardProps } from "@/components/BirdCard";
import ARViewModal from "@/components/ARViewModal";
import BirdDetailModal from "@/components/BirdDetailModal";
import { Button } from "@/components/ui/button";

import greyHeronImage from "@assets/generated_images/full-body_grey_heron_standing.png";
import paintedStorkImage from "@assets/generated_images/full-body_painted_stork.png";
import pelican from "@assets/generated_images/full-body_spot-billed_pelican.png";
import ibisImage from "@assets/generated_images/full-body_black-headed_ibis.png";
import openbillImage from "@assets/generated_images/asian_openbill_with_distinctive_bill.png";
import cormorantImage from "@assets/generated_images/little_cormorant_in_water.png";

const mockBirds: BirdCardProps[] = [
  {
    id: 1,
    commonName: "Grey Heron",
    scientificName: "Ardea cinerea",
    tamilName: "சாம்பல் நாரை",
    image: greyHeronImage,
    status: "Migratory",
    size: "90-98 cm",
    weight: "1-2 kg",
    habitat: "Fish, Frogs",
    season: "Nov-Mar",
    arModelUrl: "https://example.com/ar/grey-heron.glb",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 2,
    commonName: "Painted Stork",
    scientificName: "Mycteria leucocephala",
    tamilName: "செம்பல் நாரை",
    image: paintedStorkImage,
    status: "Resident",
    size: "93-102 cm",
    weight: "2-3.5 kg",
    habitat: "Year-round",
    season: "Year-round",
    arModelUrl: "https://example.com/ar/painted-stork.glb",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 3,
    commonName: "Spot-billed Pelican",
    scientificName: "Pelecanus philippensis",
    tamilName: "கழுகுக்கோடி",
    image: pelican,
    status: "Migratory",
    size: "125-152 cm",
    weight: "4-6 kg",
    habitat: "Fish",
    season: "Oct-Mar",
    arModelUrl: "https://example.com/ar/pelican.glb",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 4,
    commonName: "Black-headed Ibis",
    scientificName: "Threskiornis melanocephalus",
    tamilName: "கரும்பட்டை இருவாச்சி",
    image: ibisImage,
    status: "Migratory",
    size: "65-76 cm",
    weight: "1.5 kg",
    habitat: "Fish, Frogs, Snails",
    season: "Oct-Mar",
    arModelUrl: "https://example.com/ar/ibis.glb",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 5,
    commonName: "Asian Openbill",
    scientificName: "Anastomus oscitans",
    tamilName: "நத்தை கொக்கு",
    image: openbillImage,
    status: "Resident",
    size: "68-81 cm",
    weight: "1.2 kg",
    habitat: "Snails",
    season: "Year-round",
    arModelUrl: "https://example.com/ar/openbill.glb",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 6,
    commonName: "Little Cormorant",
    scientificName: "Microcarbo niger",
    tamilName: "நீர்காகம்",
    image: cormorantImage,
    status: "Resident",
    size: "50-55 cm",
    weight: "0.4-0.6 kg",
    habitat: "Fish",
    season: "Year-round",
    arModelUrl: "https://example.com/ar/cormorant.glb",
    onARView: () => {},
    onDetails: () => {},
  },
];

export default function Home() {
  const [selectedBird, setSelectedBird] = useState<BirdCardProps | null>(null);
  const [arViewOpen, setArViewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleARView = (bird: BirdCardProps) => {
    setSelectedBird(bird);
    setArViewOpen(true);
  };

  const handleDetails = (bird: BirdCardProps) => {
    setSelectedBird(bird);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <section id="species-section" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-species-title">
              Featured Species
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-species-subtitle">
              Explore our collection of migratory and resident birds. Click on AR View to see interactive 3D models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBirds.map((bird) => (
              <BirdCard
                key={bird.id}
                {...bird}
                onARView={() => handleARView(bird)}
                onDetails={() => handleDetails(bird)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" data-testid="button-load-more">
              Load More Species
            </Button>
          </div>
        </div>
      </section>

      {selectedBird && (
        <>
          <ARViewModal
            open={arViewOpen}
            onOpenChange={setArViewOpen}
            birdName={selectedBird.commonName}
            arModelUrl={selectedBird.arModelUrl || ""}
          />
          <BirdDetailModal
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            bird={selectedBird}
            onARView={() => {
              setDetailsOpen(false);
              setArViewOpen(true);
            }}
          />
        </>
      )}
    </div>
  );
}
