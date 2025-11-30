import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { FavoritesProvider } from "@/lib/favorites";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import MovieDetail from "@/pages/MovieDetail";
import Favorites from "@/pages/Favorites";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movies" component={Movies} />
      <Route path="/movie/:id" component={MovieDetail} />
      <Route path="/favorites" component={Favorites} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
