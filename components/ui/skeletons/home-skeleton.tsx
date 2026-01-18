import { Skeleton } from "../skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <Skeleton className="aspect-square w-full" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <Skeleton className="h-6 w-32 bg-white/20" />
        <Skeleton className="h-4 w-24 bg-white/20" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-125 w-full overflow-hidden">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 px-4">
        <Skeleton className="h-16 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>
    </div>
  );
}

export function BrandSkeleton() {
  return (
    <div className="flex items-center justify-center space-x-8 py-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-24" />
      ))}
    </div>
  );
}
