import { Skeleton } from "@/components/ui/skeleton";

export function CustomizationLoadingSkeleton() {
  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Search Bar */}
      <Skeleton className="h-12 w-full rounded-xl" />
      
      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Skeleton className="h-10 w-24 rounded-full shrink-0" />
        <Skeleton className="h-10 w-32 rounded-full shrink-0" />
        <Skeleton className="h-10 w-28 rounded-full shrink-0" />
        <Skeleton className="h-10 w-36 rounded-full shrink-0" />
      </div>

      {/* Design Grid */}
      <DesignsLoadingSkeleton />
    </div>
  );
}

export function DesignsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-stone-200 dark:border-slate-800 space-y-3"
        >
          {/* Design Image */}
          <Skeleton className="aspect-square w-full rounded-xl" />
          
          {/* Design Name */}
          <Skeleton className="h-5 w-3/4" />
          
          {/* Category */}
          <Skeleton className="h-4 w-1/2" />
          
          {/* Price and Button */}
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
