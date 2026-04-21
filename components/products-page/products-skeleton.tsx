import { Skeleton } from "@/components/ui/skeleton";

export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 px-2 lg:px-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full rounded-[24px] lg:rounded-[40px]" />
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-3/4 rounded-full opacity-60" />
            <Skeleton className="h-4 w-1/2 rounded-full opacity-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
