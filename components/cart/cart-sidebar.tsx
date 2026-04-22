"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    ShoppingBag,
    X,
} from "lucide-react";
import { useCartContext } from "@/context/cart-context";
import { CartItemCard } from "./cart-item-card";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/ui/custom-button";
import CustomButton2 from "@/components/ui/custom-button-2";

export const CartSidebar = () => {
    const {
        items,
        totalItems,
        subtotal,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        isFetching,
        isAdding,
        isRemoving,
        isUpdating,
        isPending
    } = useCartContext();

    const router = useRouter();

    const FREE_SHIPPING_THRESHOLD = 2000;
    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent
                showCloseButton={false}
                className="w-full sm:max-w-md p-0 flex flex-col bg-background shadow-2xl transition-all duration-500 ease-in-out border-none sm:inset-y-4 sm:right-4 sm:h-[calc(100vh-2rem)] sm:rounded-[28px] sm:border sm:border-border overflow-hidden"
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <SheetHeader className="px-6 pt-8 pb-4 space-y-0 flex-row items-center justify-between shrink-0">
                    <SheetTitle className="flex items-baseline gap-2 text-left">
                        <span className="text-2xl font-bold tracking-tight text-foreground">Your cart</span>
                        <span className="text-muted-foreground font-medium text-lg">{totalItems}</span>
                    </SheetTitle>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={18} className="text-foreground" />
                    </button>
                </SheetHeader>

                {/* ── Free Delivery Progress ──────────────────────────── */}
                <div className="px-6 pb-4 shrink-0">
                    {amountLeft > 0 ? (
                        <p className="p-sm text-foreground mb-3">
                            Add{" "}
                            <span className="font-bold">{formatCurrency(amountLeft)}</span>{" "}
                            more for{" "}
                            <span className="font-bold text-accent">FREE delivery!</span>
                        </p>
                    ) : (
                        <p className="p-sm font-bold text-accent mb-3">
                            ✓ You have qualified for FREE delivery!
                        </p>
                    )}
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-foreground transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <Separator className="bg-border shrink-0" />

                {/* ── Cart Items ──────────────────────────────────────── */}
                <ScrollArea className="flex-1 min-h-0">
                    {items.length > 0 ? (
                        <div className="divide-y divide-border px-6">
                            {items.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    variant="sidebar"
                                    onRemove={removeItem}
                                    onUpdateQuantity={updateQuantity}
                                    isUpdating={isUpdating}
                                    isRemoving={isRemoving}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-[40vh] flex flex-col items-center justify-center text-center gap-5 px-6">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">Your cart is empty</p>
                                <p className="p-sm text-muted-foreground">
                                    Start adding items to your wardrobe
                                </p>
                            </div>
                            <CustomButton2
                                bgColor="#ffffff"
                                fillColor="#000000"
                                textColor="#000000"
                                textHoverColor="#ffffff"
                                onClick={closeCart}
                                className="mt-2 border-border"
                            >
                                Browse Collection
                            </CustomButton2>
                        </div>
                    )}
                </ScrollArea>

                {/* ── Footer ─────────────────────────────────────────── */}
                {items.length > 0 && (
                    <div className="bg-foreground text-background p-6 rounded-t-[28px] space-y-5 shrink-0 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">

                        {/* Totals row */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/50">
                                    Estimated total
                                </p>
                                <p className="text-2xl font-bold text-background">
                                    {formatCurrency(subtotal)}
                                </p>
                            </div>
                        </div>

                        <p className="text-[10px] text-background/40 font-medium text-center">
                            Taxes and shipping calculated at checkout.
                        </p>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <CustomButton2
                                bgColor="transparent"
                                fillColor="rgba(255,255,255,0.15)"
                                textColor="rgba(255,255,255,0.8)"
                                textHoverColor="#ffffff"
                                className="border border-background/20 w-full h-12"
                                onClick={() => {
                                    closeCart();
                                    router.push("/cart");
                                }}
                            >
                                View Cart
                            </CustomButton2>

                            <CustomButton
                                bgColor="#ffffff"
                                circleColor="#000000"
                                textColor="#000000"
                                textHoverColor="#ffffff"
                                circleSize={44}
                                className="w-full h-12"
                                disabled={isPending}
                                onClick={() => {
                                    closeCart();
                                    router.push("/checkout");
                                }}
                            >
                                {isPending ? "Processing..." : "Check Out"}
                            </CustomButton>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
