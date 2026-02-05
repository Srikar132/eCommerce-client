"use client";



import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductActions from "@/components/product/product-actions";
import ProductAccordion from "@/components/product/product-accordian";
import VariantSelector from "@/components/product/variant-selector";
import PriceDisplay from "@/components/product/price-display";
import StockStatus from "@/components/product/stock-status";
import VariantAvailabilityInfo from "@/components/product/variant-availability-info";


import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVariantSelection } from "@/hooks/use-variant-selector";
import { Product, ProductVariant } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductDetailClientProps {
    product: Product;
    variants: ProductVariant[];
}

export default function ProductDetailClient({ product, variants }: ProductDetailClientProps) {



    // Use the variant selection hook for all variant logic
    const {
        selectedColor,
        selectedSize,
        selectedVariant,
        colors,
        sizes,
        finalPrice,
        inStock,
        setColor,
        setSize
    } = useVariantSelection({
        product,
        variants: variants || []
    });

    const {
        addItem,
        isAddingItem,
        isInCart
    } = useCart();

    const {
        toggleItem: toggleWishlist,
        isInWishlist,
        isTogglingItem: isTogglingWishlistItem
    } = useWishlist();



    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            {/* Image Gallery Section */}
            <div className="order-1 w-full">
                <div className=" border border-border/30 overflow-hidden bg-card">
                    <ProductImageGallery images={product.images} />
                </div>
            </div>

            {/* Product Details Section */}
            <ScrollArea className="order-2 w-full h-full">
                <div className="space-y-4 pr-4">

                    {/* Product Info & Price */}
                    <div className="pb-4">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-foreground tracking-tight uppercase">
                                {product.name}
                            </h1>

                            {/* description */}
                            <p className="text-sm text-muted-foreground">
                                {product.description || 'No description available'}
                            </p>
                        </div>

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
                        colors={colors}
                        sizes={sizes}
                        selectedColor={selectedColor}
                        selectedSize={selectedSize}
                        onColorChange={setColor}
                        onSizeChange={setSize}
                    />

                    {/* Variant Availability Info */}
                    {variants && (
                        <VariantAvailabilityInfo
                            variants={variants}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                        />
                    )}

                    <Separator className="bg-border/40" />

                    {/* Product Actions - Sticky on Mobile */}
                    <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 -mx-4 sm:mx-0 sm:static sm:border-0 sm:p-0 sm:bg-transparent z-20">
                        <ProductActions
                            onAddToCart={() => {
                                if (selectedVariant) {
                                    addItem({
                                        productId: product.id,
                                        productVariantId: selectedVariant.id
                                    })
                                }
                            }}
                            isInCart={selectedVariant ? isInCart(product.id, selectedVariant.id) : false}
                            disabled={!selectedVariant || isAddingItem || isTogglingWishlistItem}
                            isAddingToCart={isAddingItem}
                            onToggleWishlist={() => toggleWishlist(product.id)}
                            isInWishlist={isInWishlist(product.id)}
                            isTogglingWishlist={isTogglingWishlistItem}
                        />
                    </div>


                    <Separator className="bg-border/40" />

                    {/* Accordion Section */}
                    <div className="py-4">
                        <ProductAccordion
                            washCare={product.careInstructions || 'Standard care instructions apply'}
                        />
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}