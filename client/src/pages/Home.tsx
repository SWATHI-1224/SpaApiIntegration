import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Play, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieCard } from '@/components/MovieCard';
import { MovieGridSkeleton } from '@/components/MovieCardSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loader } from '@/components/Loader';
import type { MovieResponse, Genre, GenresResponse } from '@shared/schema';
import { getBackdropUrl, getImageUrl } from '@shared/schema';

export default function Home() {
  const { data: popularMovies, isLoading: loadingPopular, error: errorPopular, refetch: refetchPopular } = useQuery<MovieResponse>({
    queryKey: ['/api/movies/popular'],
  });

  const { data: trendingMovies, isLoading: loadingTrending } = useQuery<MovieResponse>({
    queryKey: ['/api/movies/trending'],
  });

  const { data: genresData } = useQuery<GenresResponse>({
    queryKey: ['/api/genres'],
  });

  const genres = genresData?.genres || [];
  const featuredMovie = popularMovies?.results?.[0];
  const trendingList = trendingMovies?.results?.slice(0, 10) || [];
  const popularList = popularMovies?.results?.slice(1, 11) || [];

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .slice(0, 3)
      .map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean);
  };

  if (errorPopular) {
    return (
      <div className="pt-16 pb-20 md:pb-0">
        <ErrorMessage 
          fullPage 
          onRetry={() => refetchPopular()}
          message="We couldn't load the movies. Please check your connection and try again."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {loadingPopular && !featuredMovie ? (
        <div className="h-screen flex items-center justify-center">
          <Loader size="lg" text="Loading movies..." />
        </div>
      ) : featuredMovie && (
        <>
          <section className="relative h-[85vh] min-h-[600px] overflow-hidden" data-testid="hero-section">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: featuredMovie.backdrop_path 
                  ? `url(${getBackdropUrl(featuredMovie.backdrop_path, 'original')})`
                  : 'none',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-end pb-24 md:pb-32">
              <div className="max-w-2xl">
                <Badge variant="secondary" className="mb-4 gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Featured Movie
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" data-testid="text-hero-title">
                  {featuredMovie.title}
                </h1>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {featuredMovie.vote_average > 0 && (
                    <Badge variant="secondary" className="bg-yellow-500/90 text-black border-0 gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {featuredMovie.vote_average.toFixed(1)}
                    </Badge>
                  )}
                  {featuredMovie.release_date && (
                    <span className="text-white/70 text-sm">
                      {new Date(featuredMovie.release_date).getFullYear()}
                    </span>
                  )}
                  <div className="flex gap-2">
                    {getGenreNames(featuredMovie.genre_ids).map(name => (
                      <Badge key={name} variant="outline" className="bg-white/10 text-white border-white/20">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-white/80 text-lg mb-6 line-clamp-3 leading-relaxed">
                  {featuredMovie.overview}
                </p>

                <div className="flex gap-3 flex-wrap">
                  <Link href={`/movie/${featuredMovie.id}`}>
                    <Button size="lg" className="gap-2" data-testid="button-view-details">
                      <Play className="w-5 h-5" />
                      View Details
                    </Button>
                  </Link>
                  <Link href="/movies">
                    <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/30 text-white backdrop-blur-sm" data-testid="button-browse-all">
                      Browse All Movies
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 md:px-8 py-12" data-testid="section-trending">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
              </div>
              <Link href="/movies">
                <Button variant="ghost" className="gap-2" data-testid="link-view-all-trending">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {loadingTrending ? (
              <MovieGridSkeleton count={10} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {trendingList.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          <section className="max-w-7xl mx-auto px-4 md:px-8 py-12" data-testid="section-popular">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl md:text-3xl font-bold">Popular Movies</h2>
              </div>
              <Link href="/movies">
                <Button variant="ghost" className="gap-2" data-testid="link-view-all-popular">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {loadingPopular ? (
              <MovieGridSkeleton count={10} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {popularList.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          <section className="max-w-7xl mx-auto px-4 md:px-8 py-12" data-testid="section-about">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 md:p-12">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome to CineVault</h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Discover the world of cinema with our comprehensive movie database. 
                  Browse popular titles, search for your favorites, and build your personal 
                  collection of must-watch films. Powered by TMDB.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/movies">
                    <Button data-testid="button-explore-movies">Explore Movies</Button>
                  </Link>
                  <Link href="/favorites">
                    <Button variant="outline" data-testid="button-view-favorites">View Favorites</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
