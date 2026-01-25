"use client";

import Image from "next/image";
import { useProduct, useProductVariants } from "@/lib/tanstack/queries/product.queries";
import { useDesign } from "@/lib/tanstack/queries/design.queries";
import { Loader2 } from "lucide-react";

interface StudioPreviewSectionProps {
  productSlug: string;
  designId: string;
  variantId: string;
}

export default function StudioPreviewSection({
  productSlug,
  designId,
  variantId,
}: StudioPreviewSectionProps) {
  // Fetch data using hooks with prefetched data from server
  const { data: product, isLoading: productLoading } = useProduct(productSlug);
  const { data: variants, isLoading: variantsLoading } = useProductVariants(productSlug);
  const { data: design, isLoading: designLoading } = useDesign(designId);

  // Loading state
  if (productLoading || variantsLoading || designLoading) {
    return (
      <div className="lg:col-span-7 space-y-10">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product || !design || !variants) {
    return (
      <div className="lg:col-span-7 space-y-10">
        <p className="text-slate-500">Unable to load preview</p>
      </div>
    );
  }

  const selectedVariant = variants.find((v) => v.id === variantId);

  if (!selectedVariant) {
    return (
      <div className="lg:col-span-7 space-y-10">
        <p className="text-slate-500">Variant not found</p>
      </div>
    );
  }

  const variantImageUrl = selectedVariant.images?.[0]?.imageUrl;

  return (
    <div className="lg:col-span-7 space-y-10">
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-display italic text-slate-800 dark:text-slate-200">
          Customize Your Design
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg">
          Preview your customization with the selected design and thread color. Our artisans hand-finish every piece.
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Product */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Base Product
            </span>
          </div>
          <div className="aspect-4/5 rounded-xl overflow-hidden dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md relative">
            {variantImageUrl ? (
              <Image
                src={variantImageUrl}
                alt={`${product.name} - ${selectedVariant.color}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <span className="material-icons-outlined text-6xl">checkroom</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {selectedVariant.color}
            </p>
            <p className="text-sm text-slate-500">Size: {selectedVariant.size}</p>
          </div>
        </div>

        {/* Selected Design */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Selected Embroidery
            </span>
          </div>
          <div className="aspect-4/5 rounded-xl overflow-hidden dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group relative">
            {design.designImageUrl ? (
              <Image
                src={design.designImageUrl}
                alt={design.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <span className="material-icons-outlined text-6xl">palette</span>
              </div>
            )}
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {design.name}
            </p>
            <p className="text-sm text-slate-500">Category: {design.category?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
