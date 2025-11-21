import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Ticket, Camera, Binoculars, Sun } from "lucide-react";

export default function VisitInfo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-visit-title">
            Visit Information
          </h1>
          <p className="text-muted-foreground" data-testid="text-visit-subtitle">
            Plan your visit to Vedanthangal Bird Sanctuary
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Visiting Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opening Time</span>
                  <span className="font-medium" data-testid="text-opening-time">6:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closing Time</span>
                  <span className="font-medium" data-testid="text-closing-time">6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Time to Visit</span>
                  <span className="font-medium" data-testid="text-best-time">November to February</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Entry Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Adults (Indian)</span>
                  <span className="font-medium" data-testid="text-fee-adult">₹50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Children (5-12 years)</span>
                  <span className="font-medium" data-testid="text-fee-child">₹25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Foreign Nationals</span>
                  <span className="font-medium" data-testid="text-fee-foreign">₹300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Camera Fee</span>
                  <span className="font-medium" data-testid="text-fee-camera">₹50</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Getting Here
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">By Road</h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-by-road">
                    75 km from Chennai. Regular bus services available from Chengalpattu.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">By Train</h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-by-train">
                    Nearest railway station: Chengalpattu (30 km)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">By Air</h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-by-air">
                    Nearest airport: Chennai International Airport (85 km)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                What to Bring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2" data-testid="text-bring-1">
                  <Binoculars className="h-4 w-4 text-primary" />
                  Binoculars for bird watching
                </li>
                <li className="flex items-center gap-2" data-testid="text-bring-2">
                  <Camera className="h-4 w-4 text-primary" />
                  Camera with telephoto lens
                </li>
                <li className="flex items-center gap-2" data-testid="text-bring-3">
                  <Sun className="h-4 w-4 text-primary" />
                  Sun hat and sunscreen
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
