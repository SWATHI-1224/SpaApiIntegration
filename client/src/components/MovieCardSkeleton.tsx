import { Skeleton } from '@/components/ui/skeleton';

export function MovieCardSkeleton() {
  return (
    <div className="aspect-[2/3] rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
