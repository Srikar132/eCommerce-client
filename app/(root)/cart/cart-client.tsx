"use client";

import { useCartManager } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartPageSkeleton } from "@/components/ui/skeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CartItem } from "@/types";
import type { LocalCartItem } from "@/lib/utils/local-cart";
import type { CartItemIdentifier } from "@/hooks/use-cart";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;
const GST_RATE = 0.18; // Fixed: was 0.1 (10%), should be 0.18 (18%)

// ============================================================================
// CART ITEM COMPONENT
// ============================================================================

function CartItemRow({
  item,
  isAuthenticated,
  onRemove,
  onIncrement,
  onDecrement,
  isUpdating,
  isRemoving,
}: {
  item: CartItem | LocalCartItem;
  isAuthenticated: boolean;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}) {
  // Authenticated user cart item
  if (isAuthenticated) {
    const cartItem = item as CartItem;
    
    const imageUrl = cartItem.variant?.primaryImageUrl || "/images/image-not-found.webp";

    return (
      <div className="flex gap-4 py-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
          <Image
            src={imageUrl}
            alt={cartItem.product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
          {cartItem.customization && (
            <div className="absolute right-1 top-1 rounded-full bg-purple-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
              Custom
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/products/${cartItem.product.slug}`}
                className="font-medium hover:underline"
              >
                {cartItem.product.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {cartItem.variant?.color || "N/A"} • {cartItem.variant?.size || "N/A"}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              disabled={isRemoving}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {cartItem.customization && (
            <div className="mt-2 rounded-md bg-purple-50 px-2 py-1.5 text-xs text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              🎨 Custom Design Applied
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onDecrement}
                disabled={isUpdating}
                className="h-8 w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {cartItem.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={onIncrement}
                disabled={isUpdating}
                className="h-8 w-8"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <div className="font-semibold">
                ₹{cartItem.itemTotal.toFixed(2)}
              </div>
              {cartItem.quantity > 1 && (
                <div className="text-xs text-muted-foreground">
                  ₹{cartItem.unitPrice.toFixed(2)} each
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guest cart item
  const localItem = item as LocalCartItem;
  const imageUrl = localItem.variantImageUrl || "/images/image-not-found.webp";
  const designPrice = localItem.customizationData?.designPrice || 0;
  const unitPrice = localItem.basePrice + localItem.variantPrice + designPrice;
  const itemTotal = unitPrice * localItem.quantity;

  return (
    <div className="flex gap-4 py-6">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
        <Image
          src={imageUrl}
          alt={localItem.productName}
          fill
          className="object-cover"
          sizes="96px"
        />
        {localItem.customizationData && (
          <div className="absolute right-1 top-1 rounded-full bg-purple-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
            Custom
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            {localItem.productSlug ? (
              <Link
                href={`/products/${localItem.productSlug}`}
                className="font-medium hover:underline"
              >
                {localItem.productName}
              </Link>
            ) : (
              <div className="font-medium">{localItem.productName}</div>
            )}
            <p className="text-sm text-muted-foreground">
              {localItem.variantColor || "N/A"} • {localItem.variantSize || "N/A"}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={isRemoving}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {localItem.customizationData && (
          <div className="mt-2 rounded-md bg-purple-50 px-2 py-1.5 text-xs text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            🎨 Custom Design Applied
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onDecrement}
              disabled={isUpdating}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {localItem.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={onIncrement}
              disabled={isUpdating}
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-semibold">₹{itemTotal.toFixed(2)}</div>
            {localItem.quantity > 1 && (
              <div className="text-xs text-muted-foreground">
                ₹{unitPrice.toFixed(2)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CART CLIENT COMPONENT
// ============================================================================

export default function CartClient() {
  const router = useRouter();
  const cart = useCartManager();
  const [itemToRemove, setItemToRemove] = useState<CartItemIdentifier | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Loading state
  if (cart.isLoading) {
    return <CartPageSkeleton />;
  }


  // Empty cart
  if (cart.isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
            <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => router.push("/products")} className="mt-6">
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const items = cart.items || [];
  
  const subtotal = cart.isAuthenticated
    ? (items as CartItem[]).reduce((sum, item) => sum + item.itemTotal, 0)
    : (items as LocalCartItem[]).reduce((sum, item) => {
        const designPrice = item.customizationData?.designPrice || 0;
        const unitPrice = item.basePrice + item.variantPrice + designPrice;
        return sum + unitPrice * item.quantity;
      }, 0);

  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * GST_RATE;
  const total = subtotal + shippingCost + tax;

  // Item mutation handlers
  const getItemKey = (item: CartItem | LocalCartItem): string => {
    if (cart.isAuthenticated) {
      const cartItem = item as CartItem;
      return `${cartItem.product.id}-${cartItem.variant.id}-${cartItem.customization?.id || "none"}`;
    }
    const localItem = item as LocalCartItem;
    return `${localItem.productId}-${localItem.variantId}-${localItem.customizationData?.designId || "none"}`;
  };

  // Build item identifier based on cart type
  const buildItemIdentifier = (item: CartItem | LocalCartItem): CartItemIdentifier => {
    if (cart.isAuthenticated) {
      const cartItem = item as CartItem;
      return {
        itemId: cartItem.id,
        productId: cartItem.product.id,
        variantId: cartItem.variant.id,
        designId: cartItem.customization?.designId,
        threadColorHex: cartItem.customization?.threadColorHex,
        additionalNotes: cartItem.customization?.additionalNotes,
      };
    }
    
    const localItem = item as LocalCartItem;
    return {
      productId: localItem.productId,
      variantId: localItem.variantId,
      designId: localItem.customizationData?.designId,
      threadColorHex: localItem.customizationData?.threadColorHex,
      additionalNotes: localItem.customizationData?.additionalNotes,
    };
  };

  // Handle increment/decrement with loading state
  const handleIncrement = async (item: CartItem | LocalCartItem) => {
    const key = getItemKey(item);
    setUpdatingItems((prev) => new Set(prev).add(key));
    
    try {
      const itemIdentifier = buildItemIdentifier(item);
      await cart.incrementQuantity(itemIdentifier);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleDecrement = async (item: CartItem | LocalCartItem) => {
    const key = getItemKey(item);
    setUpdatingItems((prev) => new Set(prev).add(key));
    
    try {
      const itemIdentifier = buildItemIdentifier(item);
      await cart.decrementQuantity(itemIdentifier);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleRemoveItem = async () => {
    if (!itemToRemove) return;

    try {
      await cart.removeItem(itemToRemove);
      setItemToRemove(null);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="divide-y rounded-lg border bg-card">
            {items.map((item: CartItem | LocalCartItem) => {
              const key = getItemKey(item);
              const itemIdentifier = buildItemIdentifier(item);

              return (
                <CartItemRow
                  key={key}
                  item={item}
                  isAuthenticated={cart.isAuthenticated}
                  onRemove={() => setItemToRemove(itemIdentifier)}
                  onIncrement={() => handleIncrement(item)}
                  onDecrement={() => handleDecrement(item)}
                  isUpdating={updatingItems.has(key)}
                  isRemoving={cart.isRemoving}
                />
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              size="lg"
              className="mt-6 w-full gap-2"
              disabled={cart.isEmpty}
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>

            {!cart.isAuthenticated && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Sign in at checkout for personalized pricing
              </p>
            )}

            {/* Trust Badges */}
            <div className="mt-6 space-y-3 border-t pt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <div>
                  <div className="font-medium text-foreground">Secure Checkout</div>
                  <div>Your payment information is safe</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <div>
                  <div className="font-medium text-foreground">Free Shipping</div>
                  <div>On orders above ₹{SHIPPING_THRESHOLD}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <div>
                  <div className="font-medium text-foreground">Easy Returns</div>
                  <div>30-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Confirmation Dialog */}
      <AlertDialog open={!!itemToRemove} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveItem}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}