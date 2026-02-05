"use client";

import { useCart } from "@/hooks/use-cart";
import { CartItemCard } from "./cart-item-card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginRequired } from "@/components/auth/login-required";
import PageLoadingSkeleton from "../ui/skeletons/page-loading-skeleton";

export function CartClient() {
    const {
        items,
        totalItems,
        subtotal,
        total,
        isLoading,
        removeItem,
        updateQuantity,
        isRemovingItem,
        isUpdatingQuantity,
        isAuthenticated
    } = useCart();




    // Not authenticated - show login required
    if (!isAuthenticated) {
        return (
            <LoginRequired
                title="Your Cart Awaits"
                description="Please log in to view your shopping cart and continue with your order."
            />
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <PageLoadingSkeleton/>
        );
    }

    // Empty cart state
    if (!items || items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl h-[85vh] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-semibold">Your cart is empty</h2>
                        <p className="text-sm text-muted-foreground">
                            Start adding items to your cart to see them here
                        </p>
                    </div>
                    <Button asChild size="lg" className="mt-2">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold">Shopping Cart</h1>
                <p className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onRemove={(cartItemId) => removeItem(cartItemId)}
                            onUpdateQuantity={(cartItemId, quantity) =>
                                updateQuantity({ cartItemId, quantity })
                            }
                            isRemoving={isRemovingItem}
                            isUpdating={isUpdatingQuantity}
                        />
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="border rounded-lg p-6 space-y-5 sticky top-24 bg-card">
                        <h2 className="text-lg font-semibold">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium text-green-600">FREE</span>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-base">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold text-lg">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button asChild className="w-full" size="lg">
                                <Link href="/checkout">
                                    Proceed to Checkout
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full">
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center pt-2">
                            Taxes calculated at checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
