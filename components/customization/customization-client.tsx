'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProduct, useProductVariants } from '@/lib/tanstack/queries/product.queries';
import { useInfiniteDesigns, useFlatDesigns, useDesignCount, useDesignCategories } from '@/lib/tanstack/queries/design.queries';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check, Sparkles, ShoppingBag, Download, Search } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Design } from '@/types';

interface CustomizationClientProps {
  slug: string;
  variantId?: string;
}

export default function CustomizationClient({ slug, variantId }: CustomizationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  
  // Get search and category from URL query parameters
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('tab') || 'all';

  const { data: product, isLoading: isProductLoading } = useProduct(slug);
  const { data: variants, isLoading: isVariantsLoading } = useProductVariants(slug, { enabled: !!slug });
  const { data: categories, isLoading: isCategoriesLoading } = useDesignCategories();

  // Helper function to build URL with query params
  const buildURL = (params: { search?: string; tab?: string }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Update search param
    if (params.search !== undefined) {
      if (params.search) {
        current.set('search', params.search);
      } else {
        current.delete('search');
      }
    }
    
    // Update tab param
    if (params.tab !== undefined) {
      if (params.tab && params.tab !== 'all') {
        current.set('tab', params.tab);
      } else {
        current.delete('tab');
      }
    }
    
    // Keep variantId in URL
    if (variantId) {
      current.set('variantId', variantId);
    }
    
    // Build the new URL
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    return `/customization/${slug}${query}`;
  };

  // Handler for search form submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    router.push(buildURL({ search: searchValue }));
  };

  // Handler for category tab change
  const handleCategoryChange = (value: string) => {
    router.push(buildURL({ tab: value }));
  };

  // Handler to clear all filters
  const handleClearFilters = () => {
    router.push(buildURL({ search: '', tab: 'all' }));
  };

  const {
    data: designsData,
    isLoading: isDesignsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDesigns(
    {
      categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
      q: searchQuery || undefined,
    },
    20
  );

  const designs = useFlatDesigns(designsData);
  const totalDesigns = useDesignCount(designsData);

  const sentinelRef = useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: '400px'
  });

  // Find the selected variant from the variants array
  const selectedVariant = variants?.find((v) => v.id === variantId);

  const hasVariants = variants && variants.length > 0;

  // Get the variant image - ONLY show PREVIEW_BASE images for customization
  const previewBaseImages = selectedVariant?.images?.filter((img) =>
    img.imageRole === 'PREVIEW_BASE' || !img.imageRole
  );

  const variantImage = previewBaseImages?.[0]; // Use the first PREVIEW_BASE image

  const productImage = variantImage;

  const handleContinue = () => {
    // Safety check before continuing
    if (!selectedDesignId) {
      alert("Please select a design first");
      return;
    }

    if (!product) {
      alert("Product not found");
      return;
    }

    if (!variantId || !selectedVariant) {
      alert("Invalid variant selection. Please go back and select a variant.");
      return;
    }

    // Pass both variantId and designId to the next page
    router.push(`/customization-studio/${slug}/${selectedDesignId}?variantId=${variantId}`);
  };

  if (isProductLoading || isVariantsLoading) {
    return <LoadingSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto opacity-30 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">Product Not Found</h2>
          <p className="text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push('/products')} size="lg" className="rounded-full">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // Check if product has variants
  if (!hasVariants) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto opacity-30 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">No Variants Available</h2>
          <p className="text-muted-foreground">
            This product doesn&apos;t have any variants available for customization.
          </p>
          <Button onClick={() => router.push(`/products/${slug}`)} size="lg" className="rounded-full">
            Back to Product
          </Button>
        </div>
      </div>
    );
  }

  // Show message if no variant is selected
  if (!variantId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <Sparkles className="h-16 w-16 mx-auto opacity-30 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">Select a Variant First</h2>
          <p className="text-muted-foreground">
            Please select a color and size from the product page before customizing.
          </p>
          <Button onClick={() => router.push(`/products/${slug}`)} size="lg" className="rounded-full">
            Go to Product Page
          </Button>
        </div>
      </div>
    );
  }

  // Show error if variant ID provided but not found
  if (variantId && !selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4 max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto opacity-30 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">Variant Not Found</h2>
          <p className="text-muted-foreground">
            The selected variant is not available or out of stock. Please select another variant.
          </p>
          <Button onClick={() => router.push(`/products/${slug}`)} size="lg" className="rounded-full">
            Back to Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left Column - Product Preview */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Header with Back Button */}
              <div className='flex items-start gap-4'>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-12 w-12 rounded-full hover:bg-accent/80 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-border/50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-serif font-light text-foreground mb-2">
                    Customize Your Style
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose a design that speaks to you and make it uniquely yours
                  </p>
                </div>
              </div>

              {/* Product Card - Enhanced with decorative frame */}
              <div className="relative">
                {/* Decorative outer glow */}
                <div className="absolute -inset-4 bg-linear-to-br from-primary/5 via-accent/10 to-primary/5 rounded-[3rem] blur-2xl opacity-60" />
                
                {/* Main product image container */}
                <div className="relative bg-linear-to-br from-card via-background to-accent/5 rounded-[2.5rem] p-4 shadow-2xl border border-border/20">
                  {/* Inner decorative border */}
                  <div className="relative rounded-4xl overflow-hidden bg-linear-to-br from-secondary/30 to-accent/20 p-1.5">
                    {/* Image container with rounded corners */}
                    <div className="relative w-full rounded-[1.75rem] overflow-hidden bg-card shadow-lg group"
                      style={{ aspectRatio: '4.9999/5' }}>
                      {productImage && productImage.imageUrl ? (
                        <>
                          {/* Background blur effect */}
                          <div className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110"
                            style={{ backgroundImage: `url(${productImage.imageUrl})` }}
                          />
                          
                          {/* Main image */}
                          <div className="relative w-full h-full">
                            <Image
                              src={productImage.imageUrl}
                              alt={productImage.altText || `${product.name} - ${selectedVariant?.color}`}
                              fill
                              className="object-cover transition-all duration-700 group-hover:scale-105"
                              priority
                            />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-muted via-muted/80 to-muted/50 gap-4">
                          <div className="p-8 rounded-full bg-card/90 backdrop-blur-md shadow-xl border-2 border-border/30">
                            <ShoppingBag className="h-20 w-20 opacity-15 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">No Image Available</p>
                        </div>
                      )}

                      {/* Elegant overlay gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-white/5 pointer-events-none" />
                      
                      {/* Corner decorative elements */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-xl" />
                    </div>
                  </div>

                  {/* Customizable Badge - Floating design */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground backdrop-blur-md border-2 border-background shadow-2xl px-4 py-2.5 text-xs font-bold tracking-wider hover:scale-110 transition-all duration-300 hover:shadow-primary/50">
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      CUSTOMIZABLE
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Product Info - Enhanced Card Design */}
              <div className="rounded-3xl bg-linear-to-br from-card to-accent/5 border-2 border-border/40 shadow-lg p-6 space-y-4 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-serif font-light tracking-tight text-foreground leading-tight pr-4">
                    {product.name}
                  </h2>
                  {product.basePrice !== undefined && selectedVariant?.additionalPrice !== undefined && (
                    <div className="flex flex-col items-end">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Price</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{(product.basePrice + selectedVariant.additionalPrice).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {selectedVariant ? (
                  <div className="space-y-3 pt-2">
                    {/* Color & Size - Side by Side */}
                    <div className="flex items-center gap-4">
                      {/* Color */}
                      {selectedVariant.color && (
                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 flex-1">
                          <div
                            className="h-6 w-6 rounded-full border-2 border-border shadow-md ring-2 ring-background transition-transform hover:scale-110"
                            style={{ backgroundColor: selectedVariant.colorHex || '#ffffff' }}
                            title={selectedVariant.color}
                          />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Color</p>
                            <p className="text-sm font-semibold text-foreground capitalize">
                              {selectedVariant.color}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Size */}
                      {selectedVariant.size && (
                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 flex-1">
                          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{selectedVariant.size}</span>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Size</p>
                            <p className="text-sm font-semibold text-foreground uppercase">
                              {selectedVariant.size}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stock Status - Enhanced with icons and colors */}
                    {selectedVariant.stockQuantity !== undefined && (
                      <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors",
                        selectedVariant.stockQuantity > 10 
                          ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30"
                          : selectedVariant.stockQuantity > 0 
                          ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30"
                          : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30"
                      )}>
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          selectedVariant.stockQuantity > 10 
                            ? "bg-green-100 dark:bg-green-900/40"
                            : selectedVariant.stockQuantity > 0 
                            ? "bg-amber-100 dark:bg-amber-900/40"
                            : "bg-red-100 dark:bg-red-900/40"
                        )}>
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            selectedVariant.stockQuantity > 10 
                              ? "bg-green-600"
                              : selectedVariant.stockQuantity > 0 
                              ? "bg-amber-600"
                              : "bg-red-600"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">Stock Status</p>
                          <p className={cn(
                            "text-sm font-semibold",
                            selectedVariant.stockQuantity > 10 
                              ? "text-green-700 dark:text-green-400"
                              : selectedVariant.stockQuantity > 0 
                              ? "text-amber-700 dark:text-amber-400"
                              : "text-red-700 dark:text-red-400"
                          )}>
                            {selectedVariant.stockQuantity > 0
                              ? `${selectedVariant.stockQuantity} Available`
                              : 'Out of Stock'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Additional Info Badge */}
                    <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary/60" />
                      <span>Customization adds unique value to your product</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl border border-border/50">
                    <p>No variant information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Design Selection */}
          <div className="lg:col-span-3 space-y-6 lg:px-5">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-foreground">
                  Choose Your Embroidery
                </h3>
                <p className="text-sm text-muted-foreground">Browse our collection of unique designs</p>
              </div>

              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none z-10" />
                <Input
                  type="text"
                  name="search"
                  placeholder="Search for designs..."
                  defaultValue={searchQuery}
                  className="pl-11 pr-24 h-12 rounded-2xl border-2 border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 rounded-xl"
                >
                  Search
                </Button>
              </form>

              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
                <div className="relative">
                  <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
                    <TabsList className="inline-flex w-auto min-w-full h-auto p-1.5 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50">
                      <TabsTrigger
                        value="all"
                        className="rounded-xl px-6 py-2.5 whitespace-nowrap data-[state=active]:bg-card data-[state=active]:shadow-md transition-all font-medium"
                      >
                        All Designs
                      </TabsTrigger>
                      {isCategoriesLoading ? (
                        <>
                          <Skeleton className="h-9 w-20 rounded-xl" />
                          <Skeleton className="h-9 w-24 rounded-xl" />
                        </>
                      ) : (
                        categories?.map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.slug}
                            className="rounded-xl px-6 py-2.5 whitespace-nowrap data-[state=active]:bg-card data-[state=active]:shadow-md transition-all font-medium"
                          >
                            {category.name}
                          </TabsTrigger>
                        ))
                      )}
                    </TabsList>
                  </div>
                </div>
              </Tabs>
            </div>

            {isDesignsLoading ? (
              <DesignsLoadingSkeleton />
            ) : designs.length === 0 ? (
              <div className="flex items-center justify-center p-16 border-2 border-dashed rounded-3xl border-border/60 bg-muted/20 backdrop-blur-sm">
                <div className="text-center max-w-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">No Designs Available</h4>
                  <p className="text-sm mb-5 text-muted-foreground leading-relaxed">
                    {searchQuery
                      ? `No designs found matching "${searchQuery}". Try a different search term.`
                      : 'There are currently no designs available in this category.'}
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="rounded-full border-2 hover:bg-accent hover:border-accent-foreground/20"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {designs.map((design) => (
                    <DesignCard
                      key={design.id}
                      design={design}
                      isSelected={selectedDesignId === design.id}
                      onSelect={() => setSelectedDesignId(design.id)}
                    />
                  ))}
                </div>

                {hasNextPage && (
                  <div ref={sentinelRef} className="flex items-center justify-center py-8">
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading more designs...
                      </div>
                    )}
                  </div>
                )}

                {!hasNextPage && designs.length > 0 && (
                  <p className="text-center text-sm py-4 text-muted-foreground">
                    You have viewed all {totalDesigns} designs
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border/50 backdrop-blur-xl bg-background/95 z-50 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-24 flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-3">
              {selectedDesignId ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Design Selected</p>
                    <p className="text-xs text-muted-foreground">Ready to customize</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Select a Design</p>
                    <p className="text-xs text-muted-foreground">Choose from our collection</p>
                  </div>
                </>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedDesignId}
              className={cn(
                "gap-2 rounded-full px-8 sm:px-12 h-12 sm:h-14 transition-all duration-300 font-semibold shadow-lg text-base",
                selectedDesignId
                  ? "bg-primary text-primary-foreground hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-primary/20"
                  : "cursor-not-allowed opacity-50 bg-muted text-muted-foreground"
              )}
            >
              {selectedDesignId ? (
                <>
                  Continue to Customize
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              ) : (
                'Select a Design First'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed button */}
      <div className="h-24" />
    </div>
  );
}

interface DesignCardProps {
  design: Design;
  isSelected: boolean;
  onSelect: () => void;
}

function DesignCard({ design, isSelected, onSelect }: DesignCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300 rounded-3xl border-2',
        'hover:shadow-2xl hover:-translate-y-1',
        isSelected
          ? 'ring-4 ring-primary/30 shadow-2xl scale-[1.03] border-primary/50 bg-linear-to-br from-primary/5 to-transparent'
          : 'shadow-md hover:scale-[1.02] border-border/50 hover:border-primary/30 bg-card'
      )}
    >
      <div className="relative aspect-[1.3/1] bg-card overflow-hidden">
        {design.thumbnailUrl ? (
          <Image
            src={design.thumbnailUrl}
            alt={design.name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isSelected ? "scale-105" : "group-hover:scale-110"
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted to-muted/50">
            <Sparkles className="h-12 w-12 text-muted-foreground opacity-40" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className={cn(
          "absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent transition-opacity duration-300",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl animate-in zoom-in-50 duration-300" >
            <Check className="h-5 w-5" strokeWidth={3} />
          </div>
        )}


      </div>

      <div className={cn(
        "p-4 transition-colors duration-300",
        isSelected ? "bg-primary/5" : "bg-card"
      )}>
        <p className={cn(
          "font-semibold text-sm truncate mb-1 transition-colors",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {design.name}
        </p>
        <p className="text-xs capitalize truncate text-muted-foreground">
          {design.category.name}
        </p>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="w-full rounded-3xl" style={{ aspectRatio: '4/5' }} />
            <div className="space-y-3 px-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <Skeleton className="h-7 w-64 mb-6" />
              <Skeleton className="h-12 w-full rounded-xl mb-6" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
            <DesignsLoadingSkeleton />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-end">
            <Skeleton className="h-12 w-56 rounded-full" />
          </div>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}

function DesignsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden rounded-2xl shadow-sm border-border">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2 bg-card">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}