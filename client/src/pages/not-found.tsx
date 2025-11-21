import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bird, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-primary/10 rounded-full">
            <Bird className="h-16 w-16 text-primary" data-testid="icon-bird-404" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4" data-testid="text-404">404</h1>
        <h2 className="text-2xl font-semibold mb-4" data-testid="text-not-found-title">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8" data-testid="text-not-found-message">
          The bird you're looking for has flown away. Let's get you back to familiar territory.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" data-testid="button-go-home">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            data-testid="button-go-back"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
