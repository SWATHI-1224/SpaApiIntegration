import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Clock, 
  Calendar, 
  Globe, 
  Film,
  DollarSign,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useFavorites } from '@/lib/favorites';
import type { MovieDetails, Credits, Movie } from '@shared/schema';
import { getImageUrl, getBackdropUrl } from '@shared/schema';

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen pt-16 pb-20 md:pb-8">
      <Skeleton className="h-[50vh] w-full" />
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="aspect-[2/3] rounded-lg" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MovieDetail() {
  const [, params] = useRoute('/movie/:id');
  const movieId = params?.id;

  const { toggleFavorite, isFavorite } = useFavorites();

  const { data: movie, isLoading, error, refetch } = useQuery<MovieDetails>({
    queryKey: ['/api/movies', movieId],
    enabled: !!movieId,
  });

  const { data: credits } = useQuery<Credits>({
    queryKey: ['/api/movies', movieId, 'credits'],
    enabled: !!movieId,
  });

  if (!movieId) {
    return (
      <div className="pt-16 pb-20 md:pb-0">
        <ErrorMessage fullPage message="Movie not found" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 pb-20 md:pb-0">
        <ErrorMessage 
          fullPage 
          onRetry={() => refetch()}
          message="Failed to load movie details. Please try again."
        />
      </div>
    );
  }

  if (isLoading || !movie) {
    return <MovieDetailSkeleton />;
  }

  const favorite = isFavorite(movie.id);
  const director = credits?.crew?.find(c => c.job === 'Director');
  const mainCast = credits?.cast?.slice(0, 8) || [];
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleFavoriteClick = () => {
    const simpleMovie: Movie = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      genre_ids: movie.genres?.map(g => g.id) || [],
      adult: movie.adult,
      original_language: movie.original_language,
      original_title: movie.original_title,
      video: movie.video,
    };
    toggleFavorite(simpleMovie);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div 
        className="relative h-[50vh] min-h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `url(${getBackdropUrl(movie.backdrop_path, 'original')})`
            : 'none',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        
        <div className="absolute top-20 left-4 md:left-8 z-10">
          <Link href="/movies">
            <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-48 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, 'w500') || ''}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  data-testid="img-movie-poster"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Film className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <Button
              onClick={handleFavoriteClick}
              variant={favorite ? 'default' : 'outline'}
              className="w-full mt-4 gap-2"
              data-testid="button-toggle-favorite"
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
              {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {movie.tagline && (
              <p className="text-lg text-muted-foreground italic">"{movie.tagline}"</p>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" data-testid="text-movie-title">
              {movie.title}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              {movie.vote_average > 0 && (
                <Badge variant="secondary" className="bg-yellow-500/90 text-black border-0 gap-1 text-sm px-3 py-1">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
              )}
              {year && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{movie.original_language}</span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {movie.genres.map(genre => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-movie-overview">
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </div>

            {director && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Director</h2>
                <p className="text-muted-foreground">{director.name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Votes</span>
                  </div>
                  <p className="font-semibold">{movie.vote_count.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Popularity</span>
                  </div>
                  <p className="font-semibold">{movie.popularity.toFixed(0)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Budget</span>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(movie.budget)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Revenue</span>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(movie.revenue)}</p>
                </CardContent>
              </Card>
            </div>

            {mainCast.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Top Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mainCast.map(person => (
                    <div key={person.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                        {person.profile_path ? (
                          <img
                            src={getImageUrl(person.profile_path, 'w200') || ''}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg font-medium">
                            {person.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Production Companies</h2>
                <div className="flex gap-4 flex-wrap">
                  {movie.production_companies.map(company => (
                    <Badge key={company.id} variant="outline" className="py-2 px-4">
                      {company.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
