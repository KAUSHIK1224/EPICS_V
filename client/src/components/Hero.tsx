import { Button } from "@/components/ui/button";
import { Bird, MapPin, Camera } from "lucide-react";
import heroImage from "@assets/generated_images/wetland_hero_background_image.png";

export default function Hero() {
  const handleExploreClick = () => {
    console.log('Explore species clicked');
    document.getElementById('species-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 mb-6">
          <MapPin className="h-4 w-4 text-primary-foreground" data-testid="icon-location" />
          <span className="text-sm text-primary-foreground font-medium" data-testid="text-location">Vedanthangal Bird Sanctuary, Tamil Nadu</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg" data-testid="text-hero-title">
          Explore AR-Enhanced Bird Species
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md" data-testid="text-hero-subtitle">
          Discover migratory and resident birds with interactive 3D AR models. Experience wildlife like never before.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary-border"
            onClick={handleExploreClick}
            data-testid="button-explore-species"
          >
            <Bird className="mr-2 h-5 w-5" />
            Explore Species
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-background/20 backdrop-blur-md border-white/30 text-white hover:bg-background/30"
            data-testid="button-view-gallery"
          >
            <Camera className="mr-2 h-5 w-5" />
            View Gallery
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1" data-testid="text-stat-species">150+</div>
            <div className="text-sm text-white/80" data-testid="text-stat-species-label">Species</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1" data-testid="text-stat-ar">45</div>
            <div className="text-sm text-white/80" data-testid="text-stat-ar-label">AR Models</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1" data-testid="text-stat-migratory">80%</div>
            <div className="text-sm text-white/80" data-testid="text-stat-migratory-label">Migratory</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1" data-testid="text-stat-visitors">50K+</div>
            <div className="text-sm text-white/80" data-testid="text-stat-visitors-label">Visitors</div>
          </div>
        </div>
      </div>
    </section>
  );
}
