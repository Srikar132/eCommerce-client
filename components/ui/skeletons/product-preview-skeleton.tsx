// Product Preview Skeleton
function ProductPreviewSkeleton() {
  return (
    <div className="sticky top-24 animate-pulse">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="aspect-square max-h-80 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}


export default ProductPreviewSkeleton;