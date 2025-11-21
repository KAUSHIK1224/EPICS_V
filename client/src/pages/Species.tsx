import { useState } from "react";
import Header from "@/components/Header";
import BirdCard, { BirdCardProps } from "@/components/BirdCard";
import ARViewModal from "@/components/ARViewModal";
import BirdDetailModal from "@/components/BirdDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

import greyHeronImage from "@assets/generated_images/grey_heron_species_photo.png";
import paintedStorkImage from "@assets/generated_images/painted_stork_species_photo.png";
import pelican from "@assets/generated_images/spot-billed_pelican_species_photo.png";
import ibisImage from "@assets/generated_images/black-headed_ibis_species_photo.png";
import openbillImage from "@assets/generated_images/asian_openbill_species_photo.png";
import cormorantImage from "@assets/generated_images/little_cormorant_species_photo.png";
import glossyIbisImage from "@assets/generated_images/glossy_ibis_full_body_photo.png";
import littleEgretImage from "@assets/generated_images/little_egret_full_body_photo.png";

const allBirds: BirdCardProps[] = [
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
    arModelUrl: "https://mywebar.com/p/Project_0_nbs0242503",
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
    status: "Resident",
    size: "65-76 cm",
    weight: "1.5 kg",
    habitat: "Fish, Frogs, Crustaceans",
    season: "Year-round",
    conservationStatus: "Least Concern",
    dietaryHabits: "Fish, frogs, crustaceans, aquatic insects",
    birdwatchingTips: "Found in pairs or small groups at mudflats and shallow waters. Best viewed early morning or late afternoon.",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 7,
    commonName: "Glossy Ibis",
    scientificName: "Plegadis falcinellus",
    tamilName: "மெருகுவான இருவாச்சி",
    image: glossyIbisImage,
    status: "Migratory",
    size: "48-66 cm",
    weight: "0.5-1 kg",
    habitat: "Wetlands, marshes, rice fields",
    season: "Oct-Mar",
    conservationStatus: "Least Concern",
    dietaryHabits: "Fish, amphibians, crustaceans, aquatic invertebrates",
    birdwatchingTips: "Often seen in flocks. Distinctive bronze-green iridescent plumage. Look for curved bill probing in shallow water.",
    onARView: () => {},
    onDetails: () => {},
  },
  {
    id: 8,
    commonName: "Little Egret",
    scientificName: "Egretta garzetta",
    tamilName: "சிறிய கொக்கு",
    image: littleEgretImage,
    status: "Migratory",
    size: "55-65 cm",
    weight: "0.4-0.6 kg",
    habitat: "Shallow water bodies",
    season: "Oct-Mar",
    conservationStatus: "Least Concern",
    dietaryHabits: "Small fish, tadpoles, aquatic insects, crustaceans",
    birdwatchingTips: "Pure white plumage, black bill, yellow feet. Often hunts by wading slowly. Watch for sudden strikes at prey.",
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
    habitat: "Snails, mollusks, aquatic insects",
    season: "Year-round",
    conservationStatus: "Least Concern",
    dietaryHabits: "Primarily freshwater snails, other mollusks",
    birdwatchingTips: "Distinctive gap between bill mandibles. Often seen in large flocks. Characteristic rattling call.",
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
    habitat: "Lakes, rivers, ponds",
    season: "Year-round",
    conservationStatus: "Least Concern",
    dietaryHabits: "Fish (primary), aquatic invertebrates",
    birdwatchingTips: "Excellent diver. Often seen with head and neck above water. Watch for diving hunts. Highly social birds.",
    arModelUrl: "https://example.com/ar/cormorant.glb",
    onARView: () => {},
    onDetails: () => {},
  },
];

export default function Species() {
  const [selectedBird, setSelectedBird] = useState<BirdCardProps | null>(null);
  const [arViewOpen, setArViewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleARView = (bird: BirdCardProps) => {
    setSelectedBird(bird);
    setArViewOpen(true);
  };

  const handleDetails = (bird: BirdCardProps) => {
    setSelectedBird(bird);
    setDetailsOpen(true);
  };

  const filteredBirds = allBirds.filter((bird) => {
    const matchesSearch =
      bird.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bird.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || bird.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-species-page-title">
            Species Catalog
          </h1>
          <p className="text-muted-foreground" data-testid="text-species-page-subtitle">
            Browse our complete collection of bird species
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or scientific name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-species"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === null ? "default" : "outline"}
              onClick={() => setFilterStatus(null)}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "Migratory" ? "default" : "outline"}
              onClick={() => setFilterStatus(filterStatus === "Migratory" ? null : "Migratory")}
              data-testid="button-filter-migratory"
            >
              Migratory
            </Button>
            <Button
              variant={filterStatus === "Resident" ? "default" : "outline"}
              onClick={() => setFilterStatus(filterStatus === "Resident" ? null : "Resident")}
              data-testid="button-filter-resident"
            >
              Resident
            </Button>
            <Button
              variant={filterStatus === "Rare" ? "default" : "outline"}
              onClick={() => setFilterStatus(filterStatus === "Rare" ? null : "Rare")}
              data-testid="button-filter-rare"
            >
              Rare
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground" data-testid="text-results-count">
            Showing {filteredBirds.length} of {allBirds.length} species
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBirds.map((bird) => (
            <BirdCard
              key={bird.id}
              {...bird}
              onARView={() => handleARView(bird)}
              onDetails={() => handleDetails(bird)}
            />
          ))}
        </div>

        {filteredBirds.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground" data-testid="text-no-results">
              No species found matching your criteria
            </p>
          </div>
        )}
      </div>

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
