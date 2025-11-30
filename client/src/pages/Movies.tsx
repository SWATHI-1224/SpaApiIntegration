import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Film } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';
import { MovieGridSkeleton } from '@/components/MovieCardSkeleton';
import { MovieFilters } from '@/components/MovieFilters';
import { Pagination } from '@/components/Pagination';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EmptyState } from '@/components/EmptyState';
import type { MovieResponse, GenresResponse, SortOption } from '@shared/schema';

export default function Movies() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: genresData } = useQuery<GenresResponse>({
    queryKey: ['/api/genres'],
  });

  const queryParams = new URLSearchParams({
    page: page.toString(),
    sort_by: sortBy,
    ...(selectedGenre && { with_genres: selectedGenre.toString() }),
  });

  const { data: moviesData, isLoading, error, refetch } = useQuery<MovieResponse>({
    queryKey: ['/api/movies/discover', queryParams.toString()],
  });

  const genres = genresData?.genres || [];
  const movies = moviesData?.results || [];
  const totalPages = moviesData?.total_pages || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSortBy('popularity.desc');
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-page-title">Discover Movies</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Browse and explore our extensive collection of movies
          </p>
        </header>

        <div className="mb-8">
          <MovieFilters
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {error ? (
          <ErrorMessage 
            fullPage 
            onRetry={() => refetch()}
            message="Failed to load movies. Please try again."
          />
        ) : isLoading ? (
          <MovieGridSkeleton count={20} />
        ) : movies.length === 0 ? (
          <EmptyState type="movies" />
        ) : (
          <>
            <div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
              data-testid="movies-grid"
            >
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
