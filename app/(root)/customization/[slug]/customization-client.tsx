'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProduct, useCompatibleDesigns } from '@/lib/tanstack/queries/product.queries';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CustomizationClientProps {
  slug: string;
}

export default function CustomizationClient({ slug }: CustomizationClientProps) {
  const router = useRouter();
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  // Fetch product data
  const { data: product, isLoading: isProductLoading } = useProduct(slug);

  // Fetch compatible designs
  const { data: designsData, isLoading: isDesignsLoading } = useCompatibleDesigns(slug, 0, 20);

  const designs = designsData?.designs?.content || [];

  // Find a variant with images (some variants might not have images)
  const variantWithImage = product?.variants?.find(v => v.images && v.images.length > 0);
  const productImage = variantWithImage?.images?.[0];


  const handleContinue = () => {
    if (selectedDesignId && product) {
      // Navigate to next step with selected design
      router.push(`/customization/${slug}/${selectedDesignId}`);
    }
  };

  if (isProductLoading) {
    return <LoadingSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customize Your Product</h1>
          <p className="text-muted-foreground">
            Choose a design for your {product.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-24">
          {/* Left Side - Product Display */}
          <div className="space-y-6">
            <div className="sticky top-4">
              {/* Product Image */}
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                {productImage ? (
                  <Image
                    src={productImage.imageUrl}
                    alt={productImage.altText || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4 p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Base Price:</span>
                  <span className="text-lg font-bold">
                    ${product.basePrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Design Selection */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Choose a Design ({designs.length} available)
              </h3>
              {selectedDesignId && (
                <span className="text-sm text-muted-foreground">
                  1 selected
                </span>
              )}
            </div>

            {isDesignsLoading ? (
              <DesignsLoadingSkeleton />
            ) : designs.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No designs available for this product yet.
                </p>
                <Button variant="outline" onClick={() => router.push('/products')}>
                  Browse Other Products
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="grid grid-cols-2 gap-4 pr-4">
                  {designs.map((design: any) => (
                    <DesignCard
                      key={design.id}
                      design={design}
                      isSelected={selectedDesignId === design.id}
                      onSelect={() => setSelectedDesignId(design.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              {selectedDesignId ? (
                <p className="text-sm text-muted-foreground">
                  Design selected • Ready to continue
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select a design to continue
                </p>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedDesignId}
              className="gap-2"
            >
              Continue to Customization
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface DesignCardProps {
  design: any;
  isSelected: boolean;
  onSelect: () => void;
}

function DesignCard({ design, isSelected, onSelect }: DesignCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative group rounded-lg border-2 overflow-hidden transition-all',
        'hover:shadow-lg hover:scale-[1.02]',
        isSelected
          ? 'border-primary ring-2 ring-primary ring-offset-2'
          : 'border-border hover:border-primary/50'
      )}
    >
      {/* Design Image */}
      <div className="relative aspect-square bg-muted">
        {design.imageUrl ? (
          <Image
            src={design.imageUrl}
            alt={design.name || 'Design'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No preview
          </div>
        )}

        {/* Selected Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <Check className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      {/* Design Info */}
      <div className="p-3 text-left">
        <h4 className="font-medium text-sm truncate">{design.name || 'Untitled Design'}</h4>
        {design.price && design.price > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            +${design.price.toFixed(2)}
          </p>
        )}
      </div>
    </button>
  );
}

// ============================================================================
// LOADING SKELETONS
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Skeleton */}
        <div>
          <Skeleton className="aspect-square rounded-lg mb-4" />
          <Skeleton className="h-32 rounded-lg" />
        </div>

        {/* Designs Skeleton */}
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <DesignsLoadingSkeleton />
        </div>
      </div>
    </div>
  );
}

function DesignsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
