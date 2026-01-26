import { Skeleton } from "../skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          {/* Main image */}
          <Skeleton className="aspect-3/4 w-full rounded-lg" />
          
          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
          </div>
        </div>
        
        {/* Product info skeleton */}
        <div className="space-y-6">
          {/* Brand */}
          <Skeleton className="h-5 w-32" />
          
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          {/* Price */}
          <Skeleton className="h-10 w-40" />
          
          {/* Description */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Size selector */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-16 rounded-md" />
              <Skeleton className="h-10 w-16 rounded-md" />
              <Skeleton className="h-10 w-16 rounded-md" />
              <Skeleton className="h-10 w-16 rounded-md" />
            </div>
          </div>
          
          {/* Color selector */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 w-12 rounded-md" />
          </div>
          
          {/* Additional info */}
          <div className="space-y-2 pt-6 border-t">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
