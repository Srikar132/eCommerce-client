import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="order-1 w-full">
                        <div className="space-y-4">
                            {/* Main Image */}
                            <Skeleton className="w-full aspect-square rounded-lg" />
                            
                            {/* Thumbnail Images */}
                            <div className="grid grid-cols-4 gap-2">
                                <Skeleton className="aspect-square rounded-md" />
                                <Skeleton className="aspect-square rounded-md" />
                                <Skeleton className="aspect-square rounded-md" />
                                <Skeleton className="aspect-square rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="order-2 w-full space-y-6">
                        {/* Brand and Product Name */}
                        <div className="border-b border-gray-100 pb-6 space-y-3">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-7 w-24" />
                        </div>

                        {/* Color Selector */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-40" />
                            <div className="flex gap-3">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-32" />
                            <div className="grid grid-cols-4 gap-2">
                                <Skeleton className="h-12 rounded-md" />
                                <Skeleton className="h-12 rounded-md" />
                                <Skeleton className="h-12 rounded-md" />
                                <Skeleton className="h-12 rounded-md" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4 pb-4 px-4 sm:pb-0 sm:px-0 sm:static sm:border-0 sm:pt-0 z-10">
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full rounded-md" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>

                        {/* Accordion Sections */}
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full rounded-md" />
                            <Skeleton className="h-12 w-full rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
