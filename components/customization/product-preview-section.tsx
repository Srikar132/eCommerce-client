"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useProduct, useProductVariants } from "@/lib/tanstack/queries/product.queries";
import { Loader2 } from "lucide-react";
import ErrorCard from "@/components/cards/error-card";
import Link from "next/link";

interface ProductPreviewSectionProps {
  slug: string;
  variantId: string;
}

export default function ProductPreviewSection({
  slug,
  variantId
}: ProductPreviewSectionProps) {
  // Fetch data using hooks with prefetched data from server
  const { data: product, isLoading: productLoading, error: productError } = useProduct(slug);
  const { data: variants, isLoading: variantsLoading, error: variantsError } = useProductVariants(slug);

  // Loading state
  if (productLoading || variantsLoading) {
    return (
      <div className="sticky top-24">
        <div className="flex items-center justify-center h-96  rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error handling
  if (productError) {
    return (
      <ErrorCard
        title="Failed to Load Product"
        message="There was an error loading the product. Please try again later."
      />
    );
  }

  if (variantsError) {
    return (
      <ErrorCard
        title="Failed to Load Variants"
        message="There was an error loading product variants. Please try again later."
      />
    );
  }

  // Data validation
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
        message={
          <div className="space-y-2">
            <p>Please select a color and size from the product page before customizing.</p>
            <Link
              href={`/products/${slug}`}
              className="inline-block mt-2 text-primary hover:underline font-medium"
            >
              Go to Product Page →
            </Link>
          </div>
        }
      />
    );
  }

  const selectedVariant = variants.find((v) => v.id === variantId);

  if (!selectedVariant) {
    return (
      <ErrorCard
        title="Variant Not Found"
        message={
          <div className="space-y-2">
            <p>The selected variant is not available or out of stock. Please select another variant.</p>
            <Link
              href={`/products/${slug}`}
              className="inline-block mt-2 text-primary hover:underline font-medium"
            >
              Go to Product Page →
            </Link>
          </div>
        }
      />
    );
  }

  const totalPrice = product.basePrice + (selectedVariant.additionalPrice || 0);

  // Get the variant image - ONLY show PREVIEW_BASE images for customization
  const previewBaseImages = selectedVariant.images?.filter((img) =>
    img.imageRole === 'PREVIEW_BASE' || !img.imageRole
  );

  const productImage = previewBaseImages?.[0];

  return (
    <div className="sticky top-10">
      <div className="relative group">
        {/* Background decoration - hidden on mobile */}
        <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-1 group-hover:rotate-0 transition-transform hidden lg:block"></div>

        {/* Main card - Horizontal on mobile, Vertical on desktop */}
        <div className="relative p-2 lg:p-4 rounded-2xl lg:rounded-3xl shadow-sm">
          
          {/* MOBILE HORIZONTAL LAYOUT */}
          <div className="flex lg:hidden items-center gap-3 h-32">
            {/* Product Image - Small square on mobile */}
            <div className="w-24 h-24 shrink-0 bg-stone-50 dark:bg-slate-800 rounded-xl overflow-hidden relative">
              {productImage && productImage.imageUrl ? (
                <Image
                  src={productImage.imageUrl}
                  alt={productImage.altText || `${product.name} - ${selectedVariant.color}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                  quality={75}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-icons-outlined text-slate-300 text-3xl">
                    checkroom
                  </span>
                </div>
              )}
            </div>

            {/* Product Info - Compact */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-xs leading-tight truncate">{product.name}</h3>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedVariant.color} • {selectedVariant.size}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold">₹{totalPrice}</p>
                </div>
              </div>

              {/* Stock Status - Compact */}
              {selectedVariant.stockQuantity !== undefined && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] w-fit ${selectedVariant.stockQuantity > 10
                  ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                  : selectedVariant.stockQuantity > 0
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                  }`}>
                  <span className="material-icons-outlined text-xs">
                    {selectedVariant.stockQuantity > 0 ? "check_circle" : "cancel"}
                  </span>
                  <span className="font-medium">
                    {selectedVariant.stockQuantity > 10
                      ? "In Stock"
                      : selectedVariant.stockQuantity > 0
                        ? `${selectedVariant.stockQuantity} left`
                        : "Out of Stock"}
                  </span>
                </div>
              )}

              <Badge className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border-0 w-fit">
                Customizable
              </Badge>
            </div>
          </div>

          {/* DESKTOP VERTICAL LAYOUT */}
          <div className="hidden lg:block">
            {/* Header */}
            <div className="mb-4 flex justify-between items-center px-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                Ready to Stitch
              </span>
              <Badge className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-0">
                Customizable
              </Badge>
            </div>

            {/* Product Image */}
            <div className="aspect-square max-h-80 mx-auto bg-stone-50 dark:bg-slate-800 rounded-2xl overflow-hidden relative">
              {productImage && productImage.imageUrl ? (
                <>
                  <Image
                    src={productImage.imageUrl}
                    alt={productImage.altText || `${product.name} - ${selectedVariant.color}`}
                    fill
                    className="object-cover "
                    sizes="(max-width: 1024px) 100vw, 320px"
                    priority
                    quality={85}
                  />

                  {/* Design Area Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-dashed border-primary/30">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                        <span className="material-icons-outlined text-xs">brush</span>
                        Design Area
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-icons-outlined text-slate-300 text-5xl">
                    checkroom
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-3 px-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Base Garment</p>
                  <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-slate-400">Price</p>
                  <h3 className="font-bold text-sm">₹{totalPrice}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">Color</p>
                  <h3 className="font-medium text-sm">{selectedVariant.color}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Size</p>
                  <h3 className="font-medium text-sm">{selectedVariant.size}</h3>
                </div>
              </div>

              {/* Stock Status */}
              {selectedVariant.stockQuantity !== undefined && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${selectedVariant.stockQuantity > 10
                  ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                  : selectedVariant.stockQuantity > 0
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                  }`}>
                  <span className="material-icons-outlined text-sm">
                    {selectedVariant.stockQuantity > 0 ? "check_circle" : "cancel"}
                  </span>
                  <span className="font-medium">
                    {selectedVariant.stockQuantity > 10
                      ? "In Stock"
                      : selectedVariant.stockQuantity > 0
                        ? `Only ${selectedVariant.stockQuantity} left`
                        : "Out of Stock"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
