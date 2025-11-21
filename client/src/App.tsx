import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Species from "@/pages/Species";
import Gallery from "@/pages/Gallery";
import VisitInfo from "@/pages/VisitInfo";
import Location from "@/pages/Location";
import BookVisit from "@/pages/BookVisit";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/species" component={Species} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/visit" component={VisitInfo} />
      <Route path="/location" component={Location} />
      <Route path="/book" component={BookVisit} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
