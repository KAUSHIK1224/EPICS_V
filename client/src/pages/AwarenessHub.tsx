import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Book, Star, AlertCircle, TrendingUp } from "lucide-react";
import greyHeronImage from "@assets/generated_images/full-body_grey_heron_standing.png";
import paintedStorkImage from "@assets/generated_images/full-body_painted_stork.png";
import pelican from "@assets/generated_images/full-body_spot-billed_pelican.png";
import ibisImage from "@assets/generated_images/full-body_black-headed_ibis.png";

const birdEducation = [
  {
    id: 1,
    name: "Grey Heron",
    image: greyHeronImage,
    basicInfo: {
      size: "90-98 cm",
      weight: "1-2 kg",
      lifespan: "15-20 years",
      diet: "Fish, frogs, insects",
    },
    facts: [
      "Grey herons can stand completely still for hours waiting for prey",
      "They have a sharp spear-like beak used to quickly strike at fish",
      "Can hunt in both freshwater and saltwater environments",
      "They are solitary hunters but often nest in colonies",
    ],
    astonishingFacts: [
      "Can swallow fish up to 1 foot long whole!",
      "Their eyes can see in color and move independently",
      "They have specialized feathers that don't get waterlogged",
      "A heron can retract its neck to make a sharp S-shape for faster strikes",
    ],
    conservation: "Least Concern - Stable population",
    birdwatchingTips: [
      "Best observed in early morning or late evening",
      "Look for them standing still at water edges",
      "Listen for their loud 'fraank' call during breeding season",
      "Visit wetlands, lakes, and rivers for sightings",
    ],
  },
  {
    id: 2,
    name: "Painted Stork",
    image: paintedStorkImage,
    basicInfo: {
      size: "93-102 cm",
      weight: "2-3.5 kg",
      lifespan: "12-16 years",
      diet: "Fish, frogs, crustaceans",
    },
    facts: [
      "Named for their striking pink and black plumage",
      "Use a unique feeding technique called 'tactile feeding'",
      "They breed in large colonies often with other stork species",
      "Their pink coloration is more vibrant during breeding season",
    ],
    astonishingFacts: [
      "Can eat up to 500g of fish per day!",
      "Their beaks are specially adapted to sense and catch underwater prey",
      "They perform elaborate courtship dances and bill-clattering displays",
      "Successfully adapted to human-modified wetlands and rice paddies",
    ],
    conservation: "Vulnerable - Population declining",
    birdwatchingTips: [
      "Easiest to spot during nesting season (June-September)",
      "Look for them in shallow wetlands and marshes",
      "Travel in flocks, especially during migration",
      "Watch for their synchronized feeding behavior",
    ],
  },
  {
    id: 3,
    name: "Spot-billed Pelican",
    image: pelican,
    basicInfo: {
      size: "125-152 cm",
      weight: "4-6 kg",
      lifespan: "20-30 years",
      diet: "Large fish",
    },
    facts: [
      "One of the largest freshwater birds in India",
      "Can hold up to 13.5 liters of water in their throat pouch",
      "Dive from great heights to catch fish",
      "Often seen in flocks of 20-50 birds",
    ],
    astonishingFacts: [
      "Their beak pouch is the largest of any pelican species!",
      "Can dive from 30+ meters high with tremendous force",
      "Their eyesight is so acute they can spot fish from flying height",
      "They can live for 30+ years, making them long-lived birds",
    ],
    conservation: "Vulnerable - Threatened by habitat loss",
    birdwatchingTips: [
      "Look for them in large freshwater bodies",
      "Watch for their synchronized diving behavior",
      "Often seen resting on rocks and sand banks",
      "Early morning is best for photography",
    ],
  },
  {
    id: 4,
    name: "Black-headed Ibis",
    image: ibisImage,
    basicInfo: {
      size: "65-76 cm",
      weight: "1.5 kg",
      lifespan: "15-20 years",
      diet: "Fish, frogs, snails",
    },
    facts: [
      "Most observed species at Vedanthangal Bird Sanctuary with 80 sightings",
      "Distinctive black head and white body plumage makes them easily recognizable",
      "Use their long curved bills to probe shallow water for food",
      "Often seen in flocks, especially during migration season",
    ],
    astonishingFacts: [
      "They are specialist hunters - their curved bills are perfectly designed for specific prey",
      "Can fly up to 50 km in a single day during migration",
      "Their black head coloration gets darker and more vibrant during breeding season",
      "They perform synchronized feeding dances to find food in murky water",
    ],
    conservation: "Least Concern - But declining in some regions",
    birdwatchingTips: [
      "Best spotted from October to March during migration season",
      "Look for them in shallow wetlands and marshes at Vedanthangal",
      "Watch for their feeding behavior - they often feed in groups",
      "Listen for their soft croaking calls during breeding season",
    ],
  },
];

export default function AwarenessHub() {
  const [selectedBird, setSelectedBird] = useState(0);
  const bird = birdEducation[selectedBird];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-awareness-title">
              Awareness Hub
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-awareness-subtitle">
            Learn fascinating facts about bird species and their behaviors
          </p>
        </div>

        {/* Bird Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {birdEducation.map((b, idx) => (
            <Card
              key={b.id}
              className={`cursor-pointer hover-elevate transition-all ${
                selectedBird === idx ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedBird(idx)}
              data-testid={`card-bird-select-${b.id}`}
            >
              <CardContent className="pt-4">
                <div style={{ height: "260px", width: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <img src={b.image} alt={b.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                </div>
                <h3 className="font-semibold text-center" data-testid={`text-bird-card-${b.id}`}>
                  {b.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              {bird.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basics" data-testid="tab-basics">
                  Basics
                </TabsTrigger>
                <TabsTrigger value="facts" data-testid="tab-facts">
                  Facts
                </TabsTrigger>
                <TabsTrigger value="amazing" data-testid="tab-amazing">
                  Amazing
                </TabsTrigger>
                <TabsTrigger value="conservation" data-testid="tab-conservation">
                  Conservation
                </TabsTrigger>
                <TabsTrigger value="watching" data-testid="tab-watching">
                  Watching
                </TabsTrigger>
              </TabsList>

              {/* Basics Tab */}
              <TabsContent value="basics" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(bird.basicInfo).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-muted rounded-lg"
                      data-testid={`info-${key}`}
                    >
                      <p className="text-sm text-muted-foreground capitalize mb-1">
                        {key}
                      </p>
                      <p className="font-semibold text-lg">{value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Facts Tab */}
              <TabsContent value="facts" className="space-y-3 mt-6">
                {bird.facts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
                    data-testid={`fact-${idx}`}
                  >
                    <Book className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{fact}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Astonishing Facts Tab */}
              <TabsContent value="amazing" className="space-y-3 mt-6">
                {bird.astonishingFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    data-testid={`amazing-fact-${idx}`}
                  >
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{fact}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Conservation Tab */}
              <TabsContent value="conservation" className="mt-6">
                <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Conservation Status
                      </p>
                      <Badge variant="secondary" className="bg-green-200 dark:bg-green-800">
                        {bird.conservation}
                      </Badge>
                      <div className="mt-4 space-y-2 text-sm text-green-900 dark:text-green-100">
                        <p>
                          This species faces threats from habitat loss, pollution, and climate change.
                          Supporting wetland conservation and reducing plastic use helps protect these birds.
                        </p>
                        <p>
                          Join local bird conservation groups and participate in citizen science projects
                          to help monitor and protect bird populations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Birdwatching Tips Tab */}
              <TabsContent value="watching" className="space-y-3 mt-6">
                {bird.birdwatchingTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800"
                    data-testid={`watching-tip-${idx}`}
                  >
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Educational Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2" data-testid="text-tip-1">
                  📸 Photography
                </p>
                <p className="text-sm text-muted-foreground">
                  Use telephoto lenses to capture birds without disturbing them
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2" data-testid="text-tip-2">
                  🎧 Sound Identification
                </p>
                <p className="text-sm text-muted-foreground">
                  Learn bird calls to identify species even when they're hidden
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2" data-testid="text-tip-3">
                  🌅 Best Times
                </p>
                <p className="text-sm text-muted-foreground">
                  Early morning and dusk are the most active birdwatching times
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
