import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Location() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-location-title">
            Location & Contact
          </h1>
          <p className="text-muted-foreground" data-testid="text-location-subtitle">
            Find us and get in touch
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4" data-testid="text-address">
                Vedanthangal Bird Sanctuary<br />
                Vedanthangal Village,<br />
                Chengalpattu District,<br />
                Tamil Nadu 603313, India
              </p>
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg overflow-hidden border border-border flex flex-col items-center justify-center p-6" data-testid="map-container">
                <MapPin className="h-12 w-12 text-primary mb-3" data-testid="map-icon" />
                <h3 className="text-lg font-semibold mb-2 text-center">Vedanthangal Bird Sanctuary</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">12.6397° N, 79.8619° E</p>
                <a
                  href="https://www.google.com/maps/place/Vedanthangal+Bird+Sanctuary/@12.6397,79.8619,15z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                  data-testid="button-open-map"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-phone">
                  +91 44 2745 9969
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-email">
                  info@vedanthangal.org
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Sunday</span>
                  <span className="font-medium" data-testid="text-hours">6:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak Season</span>
                  <span className="font-medium" data-testid="text-peak-season">November - February</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
