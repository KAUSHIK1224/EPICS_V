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
              <div className="aspect-video bg-muted rounded-lg overflow-hidden" data-testid="map-container">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen={true}
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0449999999996!2d79.86190000000001!3d12.6397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f5e5e5e5e5d%3A0x5e5e5e5e5e5e5e5e!2sVedanthangal%20Bird%20Sanctuary!5e0!3m2!1sen!2sin!4v1234567890"
                  data-testid="map-iframe"
                />
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
