"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductActions from "@/components/product/product-actions";
import ProductAccordion from "@/components/product/product-accordian";
import VariantSelector from "@/components/product/variant-selector";
import PriceDisplay from "@/components/product/price-display";
import StockStatus from "@/components/product/stock-status";
import VariantAvailabilityInfo from "@/components/product/variant-availability-info";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVariantSelection } from "@/hooks/use-variant-selector";
import { Product, ProductVariant } from "@/types/product";
import { useAddToCart, useIsInCart } from "@/lib/tanstack/queries/cart.queries";
import { useIsInWishlist, useToggleWishlist, useWishlist } from "@/lib/tanstack/queries/wishlist.queries";
import { showLoginDrawer } from "../ui/login-drawer";

interface ProductDetailClientProps {
    product: Product;
    variants: ProductVariant[];
}

export default function ProductDetailClient({ product, variants }: ProductDetailClientProps) {

    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();

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

    const addToCart = useAddToCart();
    const toggleWishlist = useToggleWishlist();
    const isInCart = useIsInCart({ productId: product.id, productVariantId: selectedVariant?.id! , enabled: !!session});
    const isInWishlist = useIsInWishlist({ productId: product.id, enabled: !!session });

    // Handle Add to Cart with authentication check
    const handleAddToCart = useCallback(() => {
        // Check authentication
        if (status !== "authenticated") {
            showLoginDrawer({
                description: "Please login to add items to your cart.",
            });
            return;
        }

        // Check if variant is selected
        if (!selectedVariant) {
            toast.error("Please select a variant");
            return;
        }

        // Add to cart
        addToCart.mutate({
            productId: product.id,
            productVariantId: selectedVariant.id
        });
    }, [status, selectedVariant, product.id, pathname, router, addToCart]);

    // Handle Toggle Wishlist with authentication check
    const handleToggleWishlist = useCallback(() => {
        // Check authentication
        if (status !== "authenticated") {
            showLoginDrawer();
            return;
        }

        // Toggle wishlist
        toggleWishlist.mutate(product.id);
    }, [status, product.id, pathname, router, toggleWishlist]);

    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">

            {/* Image Gallery Section */}
            <div className="order-1 w-full">
                <div className="border border-border/30 overflow-hidden bg-card">
                    <ProductImageGallery images={product.images} />
                </div>
            </div>

            {/* Product Details Section */}
            <div className="order-2 w-full relative">
                <div className="space-y-3 sm:space-y-4 pb-20 sm:pb-24 lg:pb-0">

                    {/* Product Info & Price */}
                    <div>
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl text-foreground tracking-tight">
                                {product.name}
                            </h1>

                            {/* description */}
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {product.description || 'No description available'}
                            </p>
                        </div>

                        <div className="mt-3">
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
                            <div className="mt-2">
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

                    {/* Accordion Section - Above actions on mobile */}
                    <div className="lg:hidden">
                        <ProductAccordion
                            washCare={product.careInstructions || 'Standard care instructions apply'}
                        />
                    </div>

                    {/* Product Actions - Static on Desktop */}
                    <div className="hidden lg:block pt-2">
                        <ProductActions
                            onAddToCart={handleAddToCart}
                            isInCart={isInCart}
                            disabled={!selectedVariant || addToCart.isPending || toggleWishlist.isPending}
                            isAddingToCart={addToCart.isPending}
                            onToggleWishlist={handleToggleWishlist}
                            isInWishlist={isInWishlist}
                            isTogglingWishlist={toggleWishlist.isPending}
                        />
                    </div>

                    {/* Accordion Section - Below actions on desktop */}
                    <div className="hidden lg:block">
                        <Separator className="bg-border/40 mb-2" />
                        <ProductAccordion
                            washCare={product.careInstructions || 'Standard care instructions apply'}
                        />
                    </div>
                </div>

                {/* Product Actions - Fixed at Bottom on Mobile */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border/50 p-3 sm:p-4 shadow-2xl z-50">
                    <ProductActions
                        onAddToCart={handleAddToCart}
                        isInCart={isInCart}
                        disabled={!selectedVariant || addToCart.isPending || toggleWishlist.isPending}
                        isAddingToCart={addToCart.isPending}
                        onToggleWishlist={handleToggleWishlist}
                        isInWishlist={isInWishlist}
                        isTogglingWishlist={toggleWishlist.isPending}
                    />
                </div>
            </div>
        </div>
    );
}