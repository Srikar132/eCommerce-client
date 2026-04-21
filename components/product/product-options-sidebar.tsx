"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    X,
    ExternalLink,
} from "lucide-react";
import { useProductOptions } from "@/context/product-options-context";
import { useCartContext } from "@/context/cart-context";
import ColorSelector from "./color-selector";
import SizeSelector from "./size-selector";
import PriceDisplay from "./price-display";
import StockStatus from "./stock-status";
import ProductActions from "./product-actions";
import { useVariantSelection } from "@/hooks/use-variant-selector";
import { Product, ProductVariant } from "@/types/product";
import { PLACEHOLDER_IMAGE } from "@/constants";

// ============================================================================
// Inner component — only mounted when a product is selected
// ============================================================================

function ProductOptionsInner({ product }: { product: Product }) {
    const { closeOptions } = useProductOptions();
    const { addItem, isAdding } = useCartContext();
    const router = useRouter();

    const variants: ProductVariant[] = product.variants ?? [];

    const {
        selectedColor,
        selectedSize,
        selectedVariant,
        colors,
        sizes,
        finalPrice,
        setColor,
        setSize,
    } = useVariantSelection({ product, variants });

    // const currentlyInCart = useMemo(
    //     () => (selectedVariant ? isInCart(product.id, selectedVariant.id) : false),
    //     [product.id, selectedVariant, isInCart]
    // );

    const displayImages = useMemo(() => {
        const imgs = product.images ?? [];
        return imgs.length > 0
            ? imgs
            : [{ imageUrl: PLACEHOLDER_IMAGE, altText: product.name, id: "ph", isPrimary: true, displayOrder: 0 }];
    }, [product]);

    const handleAddToCart = useCallback((quantity: number) => {
        if (!selectedVariant) return;
        addItem({
            productId: product.id,
            productVariantId: selectedVariant.id,
            quantity: quantity,
            unitPrice: finalPrice,
            product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku || "",
                primaryImageUrl: product.images?.[0]?.imageUrl || "",
            },
            variant: {
                id: selectedVariant.id,
                size: selectedVariant.size || "",
                color: selectedVariant.color || "",
                sku: selectedVariant.sku || "",
            },
        });
        closeOptions(); // cart auto-opens via CartContext mutation
    }, [selectedVariant, finalPrice, addItem, product, closeOptions]);

    const handleBuyNow = useCallback(async (quantity: number) => {
        if (!selectedVariant) return;
        await addItem({
            productId: product.id,
            productVariantId: selectedVariant.id,
            quantity: quantity,
            unitPrice: finalPrice,
            product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku || "",
                primaryImageUrl: product.images?.[0]?.imageUrl || "",
            },
            variant: {
                id: selectedVariant.id,
                size: selectedVariant.size || "",
                color: selectedVariant.color || "",
                sku: selectedVariant.sku || "",
            },
        });
        closeOptions();
        router.push("/checkout");
    }, [selectedVariant, finalPrice, addItem, product, closeOptions, router]);

    const handleViewDetails = useCallback(() => {
        closeOptions();
        router.push(`/products/${product.slug}`);
    }, [closeOptions, router, product.slug]);

    // const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
    // const canAddToCart = !!selectedVariant && !isFetching && inStock;

    return (
        // KEY: this wrapper is the flex column that fills the Sheet height.
        // Header and Footer are shrink-0; ScrollArea takes flex-1 in between.
        <div className="flex flex-col h-full overflow-hidden">

            {/* ── Header ── */}
            <SheetHeader className="px-6 pt-8 pb-4 space-y-0 flex-row items-start justify-between shrink-0">
                <div className="space-y-1.5 pr-4 flex-1 min-w-0">
                    <SheetTitle className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                        {product.name}
                    </SheetTitle>
                    <PriceDisplay
                        finalPrice={finalPrice}
                        basePrice={product.basePrice}
                        selectedVariant={selectedVariant || undefined}
                        selectedColor={selectedColor}
                        showBreakdown={true}
                    />
                </div>
                <button
                    onClick={closeOptions}
                    className="p-2 hover:bg-muted rounded-full transition-colors shrink-0 mt-0.5"
                    aria-label="Close options"
                >
                    <X size={18} className="text-foreground" />
                </button>
            </SheetHeader>

            <Separator className="bg-border shrink-0" />

            {/* ── Scrollable body — flex-1 means it takes all space between header & footer ── */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="px-6 py-5 space-y-6">

                    {/* ── Image Carousel ── */}
                    <div className="shrink-0">
                        <Carousel
                            opts={{ align: "start", loop: false }}
                            className="w-full relative group"
                        >
                            <CarouselContent className="-ml-4">
                                {displayImages.map((image, index) => (
                                    <CarouselItem key={image.id || index} className="pl-4">
                                        <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-muted">
                                            <Image
                                                src={image.imageUrl || PLACEHOLDER_IMAGE}
                                                alt={image.altText || product.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                priority={index === 0}
                                                sizes="(max-width: 768px) 100vw, 400px"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {displayImages.length > 1 && (
                                <div className="flex items-center justify-end gap-2 mt-3">
                                    <CarouselPrevious className="static translate-y-0 w-8 h-8 rounded-full border border-border bg-background hover:bg-muted" />
                                    <CarouselNext className="static translate-y-0 w-8 h-8 rounded-full border border-border bg-background hover:bg-muted" />
                                </div>
                            )}
                        </Carousel>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* ── Color Selector ── */}
                    {colors.length > 0 && (
                        <ColorSelector
                            colors={colors}
                            selectedColor={selectedColor}
                            onColorChange={setColor}
                        />
                    )}

                    {/* ── Size Selector ── */}
                    {sizes.length > 0 && (
                        <SizeSelector
                            sizes={sizes}
                            selectedSize={selectedSize}
                            onSizeChange={setSize}
                        />
                    )}

                    {/* ── Stock Status ── */}
                    {selectedVariant && (
                        <div className="pt-2">
                            <StockStatus
                                stockQuantity={selectedVariant.stockQuantity}
                                showIcon={true}
                            />
                        </div>
                    )}

                    {/* ── No size selected hint ── */}
                    {!selectedVariant && sizes.length > 0 && (
                        <p className="text-xs text-muted-foreground bg-muted/60 rounded-2xl px-4 py-3 font-medium">
                            Please select a size to continue.
                        </p>
                    )}

                    {/* ── View full details ── */}
                    <button
                        onClick={handleViewDetails}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        View more details
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </ScrollArea>

            <div className="p-6 shrink-0 border-t border-border bg-background">
                <ProductActions
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    disabled={!selectedVariant || isAdding}
                    isAddingToCart={isAdding}
                />
            </div>
        </div>
    );
}

// ============================================================================
// Product Options Sidebar — exported shell
// ============================================================================

export function ProductOptionsSidebar() {
    const { isOpen, selectedProduct, closeOptions } = useProductOptions();

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeOptions()}>
            <SheetContent
                showCloseButton={false}
                className="w-full sm:max-w-md p-0 flex flex-col bg-background shadow-2xl transition-all duration-500 ease-in-out border-none sm:inset-y-4 sm:right-4 sm:h-[calc(100vh-2rem)] sm:rounded-[28px] sm:border sm:border-border overflow-hidden"
            >
                {selectedProduct && (
                    <ProductOptionsInner product={selectedProduct} />
                )}
            </SheetContent>
        </Sheet>
    );
}
