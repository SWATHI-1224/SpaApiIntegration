import { Film, Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface EmptyStateProps {
  type: 'favorites' | 'search' | 'movies';
  searchQuery?: string;
}

export function EmptyState({ type, searchQuery }: EmptyStateProps) {
  const content = {
    favorites: {
      icon: Heart,
      title: 'No favorites yet',
      description: 'Start exploring movies and add your favorites to see them here.',
      action: {
        label: 'Browse Movies',
        href: '/movies',
      },
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: searchQuery 
        ? `We couldn't find any movies matching "${searchQuery}". Try adjusting your search.`
        : 'Try searching for a movie title.',
      action: null,
    },
    movies: {
      icon: Film,
      title: 'No movies available',
      description: 'There are no movies to display at the moment. Please try again later.',
      action: null,
    },
  };

  const { icon: Icon, title, description, action } = content[type];

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button data-testid="button-browse-movies">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
