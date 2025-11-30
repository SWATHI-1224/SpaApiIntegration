import { Heart } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';
import { EmptyState } from '@/components/EmptyState';
import { useFavorites } from '@/lib/favorites';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-page-title">My Favorites</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {favorites.length > 0 
              ? `You have ${favorites.length} movie${favorites.length === 1 ? '' : 's'} in your collection`
              : 'Your personal collection of favorite movies'
            }
          </p>
        </header>

        {favorites.length === 0 ? (
          <EmptyState type="favorites" />
        ) : (
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            data-testid="favorites-grid"
          >
            {favorites.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
