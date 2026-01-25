import { Skeleton } from "@/components/ui/skeleton";

export function CustomizationLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Product Preview */}
          <div className="lg:col-span-5">
            <Skeleton className="w-full rounded-3xl" style={{ aspectRatio: '4/5' }} />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Right Column - Designs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search */}
            <Skeleton className="h-14 w-full rounded-full" />
            
            {/* Category Tabs */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>

            {/* Design Grid */}
            <DesignsLoadingSkeleton />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-stone-200 dark:border-slate-800 backdrop-blur-lg bg-white/90 dark:bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-12 w-56 rounded-full" />
          </div>
        </div>
      </div>
      <div className="h-24" />
    </div>
  );
}

export function DesignsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm border border-stone-200 dark:border-slate-800">
          <Skeleton className="aspect-square w-full rounded-xl mb-3" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
