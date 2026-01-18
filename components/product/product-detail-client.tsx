"use client";

import { useProduct } from "@/lib/tanstack/queries/product.queries";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductActions from "@/components/product/product-actions";
import ProductFeatures from "@/components/product/product-features";
import ProductAccordion from "@/components/product/product-accordian";
import ProductDetailLoading from "@/components/product/product-detail-loading";
import ProductNotFound from "@/components/product/product-not-found";
import VariantSelector from "@/components/product/variant-selector";
import PriceDisplay from "@/components/product/price-display";
import StockStatus from "@/components/product/stock-status";
import VariantAvailabilityInfo from "@/components/product/variant-availability-info";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVariantSelection } from "@/hooks/use-variant-selector";
import { useCartManager } from "@/hooks/use-cart";
import { ProductDetailSkeleton } from "@/components/ui/skeletons";

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const { data: product, isLoading: isLoadingProduct } = useProduct(slug);
    
    // Use the variant selection hook for all variant logic
    const {
        selectedColor,
        selectedSize,
        selectedVariant,
        colorGroups,
        availableSizes,
        finalPrice,
        galleryImages,
        setColor,
        setSize
    } = useVariantSelection({
        product,
        variants: product?.variants || []
    });

    const cart = useCartManager();

    // Prepare features from product data
    const features = product ? [
        ...(product.material ? [{ id: 'material', text: product.material }] : []),
        ...(product.careInstructions ? [{ id: 'care', text: product.careInstructions }] : [])
    ] : [];

    const inCart = product && selectedVariant
        ? cart.isInCart({
            productId: product.id,
            variantId: selectedVariant.id,
        })
        : false;

    // Handle add to cart
    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        if (!selectedVariant) {
            alert("Invalid selection");
            return;
        }

        if (!product) {
            alert("Product not found");
            return;
        }

        // Log cart addition (replace with actual cart logic)
        console.log("Added to cart:", {
            productId: product.id,
            productName: product.name,
            variantId: selectedVariant.id,
            color: selectedVariant.color,
            size: selectedVariant.size,
            basePrice: product.basePrice,
            additionalPrice: selectedVariant.additionalPrice,
            finalPrice: finalPrice,
            sku: selectedVariant.sku,
            stockQuantity: selectedVariant.stockQuantity
        });


        cart.addItem({
            productId: product.id,
            productSlug : product.slug,
            productVariantId: selectedVariant.id,
            quantity: 1,
        });

    };

    // Loading state
    if (isLoadingProduct) {
        return <ProductDetailSkeleton />;
    }

    // Not found state
    if (!product || !colorGroups.length) {
        return (
            <ProductNotFound 
                productSlug={slug}
                message="The product you're looking for doesn't exist or is currently unavailable."
            />
        );
    }

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    
                    {/* Image Gallery Section */}
                    <div className="order-1 w-full">
                        <div className="rounded-xl border border-border/30 overflow-hidden bg-card">
                            <ProductImageGallery images={galleryImages} />
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <ScrollArea className="order-2 w-full h-full">
                        <div className="space-y-4 pr-4">
                            
                            {/* Product Info & Price */}
                            <div className="pb-4">
                                <ProductInfo
                                    brand={product.brandName}
                                    name={product.name}
                                    price={finalPrice}
                                    currency="INR"
                                />
                                
                                <div className="mt-4">
                                    <PriceDisplay
                                        basePrice={product.basePrice}
                                        finalPrice={finalPrice}
                                        selectedVariant={selectedVariant}
                                        selectedColor={selectedColor}
                                        currency="INR"
                                        showBreakdown={true}
                                    />
                                </div>
                                
                                {/* Stock Status */}
                                {selectedVariant && (
                                    <div className="mt-3">
                                        <StockStatus 
                                            stockQuantity={selectedVariant.stockQuantity}
                                            showIcon={true}
                                        />
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Variant Selector */}
                            <VariantSelector
                                colorGroups={colorGroups}
                                availableSizes={availableSizes}
                                selectedColor={selectedColor}
                                selectedSize={selectedSize}
                                onColorChange={setColor}
                                onSizeChange={setSize}
                            />

                            {/* Variant Availability Info */}
                            {product.variants && (
                                <VariantAvailabilityInfo
                                    variants={product.variants}
                                    selectedColor={selectedColor}
                                    selectedSize={selectedSize}
                                />
                            )}

                            <Separator className="bg-border/40" />

                            {/* Product Actions - Sticky on Mobile */}
                            <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 -mx-4 sm:mx-0 sm:static sm:border-0 sm:p-0 sm:bg-transparent z-20">
                                <ProductActions
                                    onAddToCart={handleAddToCart}
                                    disabled={!selectedSize || !selectedVariant || (selectedVariant?.stockQuantity === 0)}
                                    isCustomizable={product.isCustomizable}
                                    productSlug={product.slug}
                                    selectedVariantId={selectedVariant?.id}
                                    isInCart={inCart}
                                />
                            </div>

                            {/* Features Section */}
                            {features.length > 0 && (
                                <>
                                    <Separator className="bg-border/40" />
                                    <div className="py-4">
                                        <ProductFeatures features={features} />
                                    </div>
                                </>
                            )}

                            <Separator className="bg-border/40" />

                            {/* Accordion Section */}
                            <div className="py-4">
                                <ProductAccordion
                                    description={product.description || 'No description available'}
                                    washCare={product.careInstructions || 'Standard care instructions apply'}
                                />
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}