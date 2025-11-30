import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxVisiblePages = 5;
  const effectiveTotalPages = Math.min(totalPages, 500);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (effectiveTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 1);
      const rightBound = Math.min(effectiveTotalPages, currentPage + 1);
      
      if (leftBound > 2) {
        pages.push(1);
        pages.push('ellipsis');
      } else {
        for (let i = 1; i < leftBound; i++) {
          pages.push(i);
        }
      }
      
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      if (rightBound < effectiveTotalPages - 1) {
        pages.push('ellipsis');
        pages.push(effectiveTotalPages);
      } else {
        for (let i = rightBound + 1; i <= effectiveTotalPages; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  if (effectiveTotalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1 py-8" aria-label="Pagination" data-testid="pagination">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
        data-testid="button-first-page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        data-testid="button-prev-page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((page, index) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-[36px]"
              data-testid={`button-page-${page}`}
            >
              {page}
            </Button>
          )
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === effectiveTotalPages}
        aria-label="Next page"
        data-testid="button-next-page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(effectiveTotalPages)}
        disabled={currentPage === effectiveTotalPages}
        aria-label="Last page"
        data-testid="button-last-page"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}
