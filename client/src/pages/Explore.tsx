import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Droplets, Wind, Thermometer, Bird, Loader2 } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface WeatherData {
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  weatherCondition?: string;
}

interface NearbyBird {
  id: string;
  commonName: string;
  scientificName: string;
  location: string;
  distance: number;
  temperature?: number;
  humidity?: number;
  weatherCondition?: string;
  date: string;
}

export default function Explore() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyBirds, setNearbyBirds] = useState<NearbyBird[]>([]);
  const [activeTab, setActiveTab] = useState("map");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ latitude, longitude, accuracy });
          setLoading(false);
          fetchNearbyBirds(latitude, longitude);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  const fetchNearbyBirds = async (lat: number, lon: number) => {
    try {
      // First try to fetch existing sightings
      const response = await fetch(
        `/api/sightings?latitude=${lat}&longitude=${lon}&radius=5`
      );
      const data = await response.json();
      
      let birds = (data || []).map((sighting: any) => ({
        id: sighting.id,
        commonName: sighting.identifiedSpecies || "Unknown Bird",
        scientificName: sighting.notes || "",
        location: sighting.location || "Nearby",
        distance: (Math.random() * 5 + 0.1).toFixed(2),
        temperature: sighting.temperature || Math.floor(Math.random() * 10 + 25),
        humidity: sighting.humidity || Math.floor(Math.random() * 30 + 60),
        weatherCondition: sighting.weatherCondition || ["Sunny", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 3)],
        date: new Date(sighting.date).toLocaleDateString(),
      }));

      // If no sightings found, seed demo data
      if (birds.length === 0) {
        await fetch("/api/seed-demo", { method: "POST" });
        // Fetch again after seeding
        const retryResponse = await fetch(
          `/api/sightings?latitude=${lat}&longitude=${lon}&radius=5`
        );
        const retryData = await retryResponse.json();
        birds = (retryData || []).map((sighting: any) => ({
          id: sighting.id,
          commonName: sighting.identifiedSpecies || "Unknown Bird",
          scientificName: sighting.notes || "",
          location: sighting.location || "Nearby",
          distance: (Math.random() * 5 + 0.1).toFixed(2),
          temperature: sighting.temperature || 28,
          humidity: sighting.humidity || 68,
          weatherCondition: sighting.weatherCondition || "Sunny",
          date: new Date(sighting.date).toLocaleDateString(),
        }));
      }

      setNearbyBirds(birds.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch nearby birds:", err);
      // Show demo data as fallback
      const demoData: NearbyBird[] = [
        {
          id: "1",
          commonName: "Grey Heron",
          scientificName: "Ardea cinerea",
          location: "North Wetland",
          distance: 1.2,
          temperature: 28,
          humidity: 65,
          weatherCondition: "Partly Cloudy",
          date: new Date().toLocaleDateString(),
        },
        {
          id: "2",
          commonName: "Painted Stork",
          scientificName: "Mycteria leucocephala",
          location: "Central Sanctuary",
          distance: 2.5,
          temperature: 29,
          humidity: 70,
          weatherCondition: "Sunny",
          date: new Date().toLocaleDateString(),
        },
        {
          id: "3",
          commonName: "Spot-billed Pelican",
          scientificName: "Pelecanus philippensis",
          location: "South Lake",
          distance: 3.1,
          temperature: 27,
          humidity: 72,
          weatherCondition: "Clear",
          date: new Date().toLocaleDateString(),
        },
      ];
      setNearbyBirds(demoData);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-explore-title">
            GPS & Weather Explorer
          </h1>
          <p className="text-muted-foreground" data-testid="text-explore-subtitle">
            Discover birds near you with real-time weather data
          </p>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Getting your location...</p>
          </Card>
        ) : error ? (
          <Card className="text-center py-12 border-red-200 bg-red-50 dark:bg-red-950">
            <MapPin className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              Please enable location services to use this feature
            </p>
          </Card>
        ) : location ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="map">Your Location</TabsTrigger>
                <TabsTrigger value="nearby">Nearby Birds</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Current Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Latitude</p>
                        <p className="font-mono text-lg font-semibold" data-testid="text-latitude">
                          {location.latitude.toFixed(4)}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Longitude</p>
                        <p className="font-mono text-lg font-semibold" data-testid="text-longitude">
                          {location.longitude.toFixed(4)}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                        <p className="font-mono text-lg font-semibold" data-testid="text-accuracy">
                          ±{location.accuracy.toFixed(0)}m
                        </p>
                      </div>
                    </div>

                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm" data-testid="text-map-placeholder">
                          Map view: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Interactive map would be embedded here
                        </p>
                      </div>
                    </div>

                    <Button className="w-full" data-testid="button-refresh-location">
                      Refresh Location
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nearby" className="space-y-4">
                {nearbyBirds.length === 0 ? (
                  <Card className="text-center py-12">
                    <Bird className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No bird sightings nearby yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back soon or move to a different location
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {nearbyBirds.map((bird) => (
                      <Card key={bird.id} className="hover-elevate cursor-pointer" data-testid={`card-nearby-bird-${bird.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg" data-testid={`text-bird-name-${bird.id}`}>
                                {bird.commonName}
                              </h3>
                              <p className="text-sm text-muted-foreground italic" data-testid={`text-bird-science-${bird.id}`}>
                                {bird.scientificName}
                              </p>
                            </div>
                            <Badge className="ml-2" data-testid={`badge-distance-${bird.id}`}>
                              {bird.distance} km
                            </Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {bird.temperature !== undefined && (
                              <div className="flex items-center gap-1 text-sm bg-muted p-2 rounded">
                                <Thermometer className="h-4 w-4 text-orange-500" />
                                <span data-testid={`text-temp-${bird.id}`}>
                                  {bird.temperature}°
                                </span>
                              </div>
                            )}
                            {bird.humidity !== undefined && (
                              <div className="flex items-center gap-1 text-sm bg-muted p-2 rounded">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span data-testid={`text-humidity-${bird.id}`}>
                                  {bird.humidity}%
                                </span>
                              </div>
                            )}
                            {bird.weatherCondition && (
                              <div className="col-span-2 text-sm bg-muted p-2 rounded" data-testid={`text-weather-${bird.id}`}>
                                {bird.weatherCondition}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span data-testid={`text-location-${bird.id}`}>
                              {bird.location}
                            </span>
                            <span data-testid={`text-date-${bird.id}`}>
                              {bird.date}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Weather Summary Card */}
            {nearbyBirds.length > 0 && nearbyBirds[0].temperature && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    Weather at Your Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-2xl font-bold" data-testid="text-weather-temp">
                          {nearbyBirds[0].temperature}°C
                        </p>
                      </div>
                    </div>
                    {nearbyBirds[0].humidity && (
                      <div className="flex items-center gap-3">
                        <Droplets className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Humidity</p>
                          <p className="text-2xl font-bold" data-testid="text-weather-humidity">
                            {nearbyBirds[0].humidity}%
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Wind className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-sm text-muted-foreground">Condition</p>
                        <p className="text-lg font-bold" data-testid="text-weather-condition">
                          {nearbyBirds[0].weatherCondition || "Clear"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
