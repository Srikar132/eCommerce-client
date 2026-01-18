import { Skeleton } from "../skeleton";

export function SearchResultSkeleton() {
  return (
    <div className="flex gap-4 p-3 rounded-md hover:bg-muted/50">
      <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
      
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SearchDropdownSkeleton() {
  return (
    <div className="space-y-2 p-2">
      <SearchResultSkeleton />
      <SearchResultSkeleton />
      <SearchResultSkeleton />
      <SearchResultSkeleton />
      <SearchResultSkeleton />
    </div>
  );
}
