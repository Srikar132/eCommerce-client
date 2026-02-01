import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for product recommendations section
 */
export function RecommendationsSkeleton() {
  return (
    <section className="mt-12 lg:mt-16">
      <div className="mb-6 lg:mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-px w-20" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-3/4 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
