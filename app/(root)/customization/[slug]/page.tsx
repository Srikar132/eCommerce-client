import { Suspense } from "react";
import { productApi } from "@/lib/api/product";
import ProductPreviewSection from "@/components/customization/product-preview-section";
import DesignSelectionSection from "@/components/customization/design-selection-section";
import { CustomizationLoadingSkeleton } from "@/components/ui/skeletons/customization-skeleton";
import ErrorCard from "@/components/cards/error-card";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";


interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variantId?: string; search?: string; tab?: string }>;
}



// Main content component that accesses params/searchParams
async function CustomizationContent({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { variantId, search, tab } = await searchParams;

  const searchQuery = search || '';
  const selectedCategory = tab || 'all';

  const queryClient = getQueryClient();

  // Prefetch product and variants data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['product', slug],
      queryFn: () => productApi.getProductBySlug(slug),
    }),
    queryClient.prefetchQuery({
      queryKey: ['productVariants', slug],
      queryFn: () => productApi.getProductVariants(slug),
    }),
  ]);

  // Get product and variants from cache for validation
  const product = queryClient.getQueryData(['product', slug]) as any;
  const variants = queryClient.getQueryData(['productVariants', slug]) as any[];

  // Validation checks
  if (!product) {
    return (
      <ErrorCard
        title="Product Not Found"
        message="The product you're looking for doesn't exist or has been removed."
      />
    );
  }

  if (!variants || variants.length === 0) {
    return (
      <ErrorCard
        title="No Variants Available"
        message="This product doesn't have any variants available for customization."
      />
    );
  }

  if (!variantId) {
    return (
      <ErrorCard
        title="Select a Variant First"
        message="Please select a color and size from the product page before customizing."
      />
    );
  }

  const selectedVariant = variants.find((v) => v.id === variantId);

  if (!selectedVariant) {
    return (
      <ErrorCard
        title="Variant Not Found"
        message="The selected variant is not available or out of stock. Please select another variant."
      />
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/products/${slug}`}
              className="w-10 h-10 rounded-full border border-stone-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-icons-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-display italic font-semibold">Customize Your Style</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Step 2: Choose your embroidery design</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Product Preview */}
            <div className="lg:col-span-5">
              <ProductPreviewSection
                slug={slug}
                variantId={variantId}
              />
            </div>

            {/* Right Column - Design Selection (Server Component with prefetch) */}
            <Suspense fallback={<CustomizationLoadingSkeleton />}>
              <DesignSelectionSection
                slug={slug}
                variantId={variantId}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </HydrationBoundary>
  );
}


export default function CustomizationPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <CustomizationContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}