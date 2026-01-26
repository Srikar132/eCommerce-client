


import { Suspense } from "react";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { productApi } from "@/lib/api/product";
import { designsApi } from "@/lib/api/design";
import StudioHeader from "@/components/customization-studio/studio-header";
import StudioContentClient from "@/components/customization-studio/studio-content-client";
import ErrorCard from "@/components/cards/error-card";
import PageLoadingSkeleton from "@/components/ui/skeletons/page-loading-skeleton";

// Add metadata
export const metadata = {
  title: "Customization Studio | Armoire",
  description: "Customize your product with our design studio",
};



interface PageProps {
  params: Promise<{ productSlug: string; designId: string }>;
  searchParams: Promise<{ variantId?: string }>;
}

async function CustomizationStudioContent({ params, searchParams }: PageProps) {
  const { productSlug, designId } = await params;
  const { variantId } = await searchParams;

  if (!variantId) {
    return (
      <ErrorCard
        title="Variant Required"
        message="Please select a variant before accessing the customization studio."
      />
    );
  }

  const queryClient = getQueryClient();

  // Prefetch all required data in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["product", productSlug],
      queryFn: () => productApi.getProductBySlug(productSlug),
    }),
    queryClient.prefetchQuery({
      queryKey: ["productVariants", productSlug],
      queryFn: () => productApi.getProductVariants(productSlug),
    }),
    queryClient.prefetchQuery({
      queryKey: ["design", designId],
      queryFn: () => designsApi.getDesignById(designId),
    }),
  ]);

  // Get product from cache for validation and header
  const product = queryClient.getQueryData(["product", productSlug]) as any;

  if (!product) {
    return (
      <ErrorCard
        title="Product Not Found"
        message="The product you're looking for doesn't exist or has been removed."
      />
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
        <StudioHeader productSlug={productSlug} productName={product.name} variantId={variantId} />
        <StudioContentClient
          productSlug={productSlug}
          designId={designId}
          variantId={variantId}
        />
      </div>
    </HydrationBoundary>
  );
}

export default async function CustomizationStudioPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <CustomizationStudioContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

