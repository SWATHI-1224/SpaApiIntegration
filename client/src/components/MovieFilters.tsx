import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Genre, SortOption } from '@shared/schema';
import { sortOptions } from '@shared/schema';

interface MovieFiltersProps {
  genres: Genre[];
  selectedGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
}

export function MovieFilters({
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: MovieFiltersProps) {
  const hasActiveFilters = selectedGenre !== null || sortBy !== 'popularity.desc';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[180px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedGenre?.toString() || 'all'} 
            onValueChange={(value) => onGenreChange(value === 'all' ? null : parseInt(value))}
          >
            <SelectTrigger className="w-[180px]" data-testid="select-genre">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map(genre => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="gap-1"
            data-testid="button-clear-filters"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {selectedGenre && genres.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <Badge 
            variant="secondary" 
            className="gap-1 cursor-pointer"
            onClick={() => onGenreChange(null)}
          >
            {genres.find(g => g.id === selectedGenre)?.name}
            <X className="w-3 h-3" />
          </Badge>
        </div>
      )}
    </div>
  );
}
