import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import greyHeronImage from "@assets/generated_images/grey_heron_species_photo.png";
import paintedStorkImage from "@assets/generated_images/painted_stork_species_photo.png";
import pelican from "@assets/generated_images/spot-billed_pelican_species_photo.png";
import ibisImage from "@assets/generated_images/black-headed_ibis_species_photo.png";
import openbillImage from "@assets/generated_images/asian_openbill_species_photo.png";
import cormorantImage from "@assets/generated_images/little_cormorant_species_photo.png";
import heroImage from "@assets/generated_images/wetland_hero_background_image.png";

const galleryImages = [
  { id: 1, src: heroImage, title: "Wetland Habitat", category: "Landscape" },
  { id: 2, src: greyHeronImage, title: "Grey Heron", category: "Birds" },
  { id: 3, src: paintedStorkImage, title: "Painted Stork", category: "Birds" },
  { id: 4, src: pelican, title: "Spot-billed Pelican", category: "Birds" },
  { id: 5, src: ibisImage, title: "Black-headed Ibis", category: "Birds" },
  { id: 6, src: openbillImage, title: "Asian Openbill", category: "Birds" },
  { id: 7, src: cormorantImage, title: "Little Cormorant", category: "Birds" },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-gallery-title">
            Photo Gallery
          </h1>
          <p className="text-muted-foreground" data-testid="text-gallery-subtitle">
            Explore stunning photography from Vedanthangal Bird Sanctuary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden group hover-elevate cursor-pointer"
              data-testid={`card-gallery-${image.id}`}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-testid={`img-gallery-${image.id}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold" data-testid={`text-gallery-title-${image.id}`}>
                    {image.title}
                  </h3>
                  <Badge variant="secondary" data-testid={`badge-category-${image.id}`}>
                    {image.category}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
