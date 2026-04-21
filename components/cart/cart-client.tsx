"use client";

import { useCartContext } from "@/context/cart-context";
import { CartItemCard } from "./cart-item-card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import PageLoadingSkeleton from "../ui/skeletons/page-loading-skeleton";
import CustomButton from "../ui/custom-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../ui/card";

export function CartClient() {
    const {
        items,
        totalItems,
        subtotal,
        total,
        isLoading,
        isFetching,
        removeItem,
        updateQuantity
    } = useCartContext();

    // Loading state
    if (isLoading) {
        return <PageLoadingSkeleton />;
    }

    // Empty cart state
    if (!items || items.length === 0) {
        return (
            <div className="py-12 md:py-16 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-accent/5 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-accent/40" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Your bag is empty</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Looks like you haven&apos;t added anything to your wardrobe yet. Start exploring our latest collections.
                        </p>
                    </div>
                    <CustomButton
                        href="/products"
                        bgColor="#000000"
                        circleColor="#ffffff"
                        textColor="#ffffff"
                        textHoverColor="#000000"
                        className="h-12 px-8"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Start Shopping</span>
                    </CustomButton>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Shopping Bag</h1>
                    <p className="text-sm text-muted-foreground tracking-tight">
                        Review your selections and proceed to checkout.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                        {totalItems} {totalItems === 1 ? "Item" : "Items"} in Bag
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-7 space-y-4">
                    {items.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onRemove={(cartItemId) => removeItem(cartItemId)}
                            onUpdateQuantity={(cartItemId, quantity) =>
                                updateQuantity(cartItemId, quantity)
                            }
                            isUpdating={isFetching}
                            isRemoving={isFetching}
                        />
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-5 lg:sticky lg:top-24">
                    <Card className="bg-accent/5 rounded-[32px] border-border/10 shadow-none overflow-hidden">
                        <CardHeader className="p-6 pb-2 space-y-1">
                            <CardTitle className="text-xl font-bold tracking-tight">Order Summary</CardTitle>
                            <CardDescription className="text-[10px] text-muted-foreground tracking-wide uppercase font-bold opacity-60">
                                Shipping & Taxes calculated at next step
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 pt-4 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-bold tracking-tight">₹{subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-bold text-accent uppercase tracking-widest text-[10px]">Complimentary</span>
                                </div>

                                <div className="pt-4 border-t border-border/20">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold tracking-tight">Total</span>
                                        <span className="text-xl font-bold tracking-tighter">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <CustomButton
                                    href="/checkout"
                                    bgColor="#000000"
                                    circleColor="#ffffff"
                                    textColor="#ffffff"
                                    textHoverColor="#000000"
                                    className="w-full"
                                    circleSize={45}
                                >
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Checkout Now</span>
                                </CustomButton>

                                <Link
                                    href="/products"
                                    className="block w-full text-center py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 px-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                            </div>
                            <p className="text-[10px] leading-relaxed text-muted-foreground opacity-70">
                                All items are handcrafted and customized to your specific measurements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
