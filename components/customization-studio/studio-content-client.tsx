"use client";

import StudioPreviewSection from "./studio-preview-section";
import StudioOptionsSection from "./studio-options-section";

interface StudioContentClientProps {
  productSlug: string;
  designId: string;
  variantId: string;
}

export default function StudioContentClient({
  productSlug,
  designId,
  variantId,
}: StudioContentClientProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Preview Images */}
        <StudioPreviewSection
          productSlug={productSlug}
          designId={designId}
          variantId={variantId}
        />

        {/* Right: Customization Options */}
        <StudioOptionsSection
          productSlug={productSlug}
          designId={designId}
          variantId={variantId}
        />
      </div>
    </main>
  );
}
