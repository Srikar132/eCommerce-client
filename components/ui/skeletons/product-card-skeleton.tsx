import { Skeleton } from "../skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
      {/* Image skeleton */}
      <div className="relative aspect-3/2 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        {/* Brand */}
        <Skeleton className="h-4 w-20" />
        
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Price and rating container */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <Skeleton className="h-6 w-24" />
          
          {/* Rating */}
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
