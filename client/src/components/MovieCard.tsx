import { Link } from 'wouter';
import { Heart, Star, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/lib/favorites';
import type { Movie } from '@shared/schema';
import { getImageUrl } from '@shared/schema';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <Link href={`/movie/${movie.id}`}>
      <article
        className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-muted hover-elevate cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
        data-testid={`card-movie-${movie.id}`}
      >
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, 'w500') || ''}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
            <Film className="w-12 h-12 mb-2" />
            <span className="text-sm text-center px-4">{movie.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-semibold text-lg leading-tight mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {year && (
              <span className="text-white/70 text-sm">{year}</span>
            )}
            {rating && (
              <Badge variant="secondary" className="bg-yellow-500/90 text-black border-0 gap-1">
                <Star className="w-3 h-3 fill-current" />
                {rating}
              </Badge>
            )}
          </div>
        </div>

        {rating && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-0 gap-1 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {rating}
            </Badge>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-black/50 backdrop-blur-sm border-0 ${
            favorite ? 'text-red-500' : 'text-white'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          onClick={handleFavoriteClick}
          data-testid={`button-favorite-${movie.id}`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
        </Button>
      </article>
    </Link>
  );
}
