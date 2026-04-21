"use client";

import { useCallback } from "react";
import { ShieldCheck, Truck, RotateCcw, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProductActions from "./product-actions";
import { useVariantSelection } from "@/hooks/use-variant-selector";
import { Product, ProductVariant } from "@/types/product";
import { useCartContext } from "@/context/cart-context";
import ProductAccordion from "./product-accordian";
import ProductImageGallery from "./product-image-gallery";
import ColorSelector from "./color-selector";
import SizeSelector from "./size-selector";
import BreadcrumbNavigation from "../breadcrumb-navigation";

interface ProductDetailClientProps {
    product: Product;
    variants: ProductVariant[];
}

export default function ProductDetailClient({ product, variants }: ProductDetailClientProps) {
    const {
        selectedColor,
        selectedSize,
        selectedVariant,
        colors,
        sizes,
        finalPrice,
        setColor,
        setSize,
    } = useVariantSelection({
        product,
        variants: variants || []
    });

    const { addItem, isFetching } = useCartContext();

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
                sku: product.sku || '',
                primaryImageUrl: product.images?.[0]?.imageUrl || ''
            },
            variant: {
                id: selectedVariant.id,
                size: selectedVariant.size || '',
                color: selectedVariant.color || '',
                sku: selectedVariant.sku || ''
            }
        });
    }, [selectedVariant, finalPrice, addItem, product]);

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
                sku: product.sku || '',
                primaryImageUrl: product.images?.[0]?.imageUrl || ''
            },
            variant: {
                id: selectedVariant.id,
                size: selectedVariant.size || '',
                color: selectedVariant.color || '',
                sku: selectedVariant.sku || ''
            }
        });
        window.location.href = "/checkout";
    }, [selectedVariant, finalPrice, addItem, product]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 max-w-[1440px] mx-auto">
            {/* ── LEFT: IMAGE GALLERY (7/12 cols) ── */}
            <div className="lg:col-span-7">
                <ProductImageGallery
                    images={product.images}
                    productName={product.name}
                    productSlug={product.slug}
                />
            </div>

            {/* ── RIGHT: PRODUCT INFO (5/12 cols) ── */}
            <div className="lg:col-span-5 relative">
                <div className="lg:sticky lg:top-24 flex flex-col pt-0 lg:pt-4">
                    {/* Breadcrumbs */}
                    <div className="mb-6 hidden lg:block">
                        <BreadcrumbNavigation />
                    </div>
                    <div className="space-y-8">
                        {/* Badge & Title */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 rounded-full bg-[#5FB281] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                    New Arrival
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-bold text-foreground">
                                {formatCurrency(finalPrice)}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed text-lg max-w-xl">
                            {product.description || "Crafted from premium materials, this piece embodies understated elegance with its timeless design and exceptional comfort."}
                        </p>

                        {/* Variant Selectors */}
                        <div className="space-y-10">
                            {/* Color Selector Component */}
                            {colors.length > 0 && (
                                <ColorSelector
                                    colors={colors}
                                    selectedColor={selectedColor}
                                    onColorChange={setColor}
                                />
                            )}

                            {/* Size Selector Component */}
                            {sizes.length > 0 && (
                                <SizeSelector
                                    sizes={sizes.map(s => ({
                                        size: s.size,
                                        variantId: s.variantId,
                                        inStock: s.inStock,
                                        priceModifier: s.priceModifier
                                    }))}
                                    selectedSize={selectedSize}
                                    onSizeChange={setSize}
                                />
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 text-[#5FB281]">
                            <Check size={18} strokeWidth={2.5} />
                            <span className="text-sm font-semibold">In stock and ready to ship</span>
                        </div>

                        {/* Product Actions */}
                        <div className="pt-4 max-w-md">
                            <ProductActions
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                                disabled={!selectedVariant || isFetching}
                                isAddingToCart={isFetching}
                            />
                        </div>

                        {/* Accordion */}
                        <div className="pt-4 border-t border-foreground/5">
                            <ProductAccordion
                                description={product.description}
                                washCare={product.careInstructions}
                                material={product.material}
                            />
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-foreground/5">
                            {[
                                { Icon: ShieldCheck, label: "Artisan Quality" },
                                { Icon: Truck, label: "Express Ship" },
                                { Icon: RotateCcw, label: "Easy Returns" },
                            ].map(({ Icon, label }) => (
                                <div key={label} className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-foreground" strokeWidth={1} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
