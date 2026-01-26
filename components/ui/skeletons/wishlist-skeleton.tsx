import { Skeleton } from "../skeleton";
import { Card, CardContent } from "../card";

export function WishlistCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-md">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3 p-4">
          {/* Brand */}
          <Skeleton className="h-3 w-16" />
          
          {/* Title */}
          <Skeleton className="h-5 w-full" />
          
          {/* Price */}
          <Skeleton className="h-6 w-20" />
          
          {/* Stock status */}
          <Skeleton className="h-4 w-24" />
          
          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WishlistGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <WishlistCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function WishlistPageSkeleton() {
  return (
    <section className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Header Skeleton */}
        <Card className="mb-8 overflow-hidden border-border bg-card shadow-lg rounded-3xl">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar Skeleton */}
        <Card className="mb-6 overflow-hidden border-border bg-card rounded-2xl shadow-md">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Grid Skeleton */}
        <WishlistGridSkeleton count={8} />

        {/* Bottom Actions Skeleton */}
        <Card className="mt-8 border-border shadow-lg bg-card rounded-3xl overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Skeleton className="h-10 w-48 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
