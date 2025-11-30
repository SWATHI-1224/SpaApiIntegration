import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Film, Heart, Sun, Moon, Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/lib/theme';
import { useFavorites } from '@/lib/favorites';
import { useQuery } from '@tanstack/react-query';
import type { Movie, MovieResponse } from '@shared/schema';
import { getImageUrl } from '@shared/schema';

export function Navbar() {
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: searchResults, isLoading: isSearching } = useQuery<MovieResponse>({
    queryKey: ['/api/movies/search', debouncedQuery],
    enabled: debouncedQuery.length >= 2,
  });

  const handleSearchSelect = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
    setSearchQuery('');
    setShowResults(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/movies', label: 'Movies' },
    { path: '/favorites', label: 'Favorites' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home-logo">
          <Film className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold hidden sm:block">CineVault</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.path} href={link.path}>
              <Button
                variant="ghost"
                className={`px-4 ${location === link.path ? 'bg-accent text-accent-foreground' : ''}`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
          <div ref={searchRef} className="relative flex-1 md:flex-initial md:w-64 lg:w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="pl-9 pr-8 bg-muted/50 border-muted"
                data-testid="input-search"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              {isSearching && debouncedQuery.length >= 2 && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {showResults && debouncedQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-popover-border rounded-md shadow-lg max-h-96 overflow-y-auto" data-testid="search-results-dropdown">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : searchResults?.results && searchResults.results.length > 0 ? (
                  <ul className="py-2">
                    {searchResults.results.slice(0, 8).map(movie => (
                      <li key={movie.id}>
                        <button
                          onClick={() => handleSearchSelect(movie)}
                          className="w-full flex items-center gap-3 px-4 py-2 hover-elevate text-left"
                          data-testid={`search-result-${movie.id}`}
                        >
                          {movie.poster_path ? (
                            <img
                              src={getImageUrl(movie.poster_path, 'w200') || ''}
                              alt={movie.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                              <Film className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{movie.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">No movies found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="relative" data-testid="button-favorites">
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-primary text-primary' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {favorites.length > 99 ? '99+' : favorites.length}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border py-2 px-4">
        <div className="flex items-center justify-around">
          {navLinks.map(link => (
            <Link key={link.path} href={link.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${location === link.path ? 'text-primary' : 'text-muted-foreground'}`}
                data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
              >
                {link.label === 'Home' && <Film className="w-5 h-5" />}
                {link.label === 'Movies' && <Search className="w-5 h-5" />}
                {link.label === 'Favorites' && <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-current' : ''}`} />}
                <span className="text-xs">{link.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
