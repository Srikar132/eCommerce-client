"use client";

import { useCartManager, CartItemIdentifier } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
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
import { useProduct } from "@/lib/tanstack/queries/product.queries";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;
const GST_RATE = 0.18;

// ============================================================================
// CART ITEM COMPONENT
// ============================================================================

interface CartItemDisplayData {
  productName: string;
  productSlug: string;
  variantColor: string;
  variantSize: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  hasCustomization: boolean;
  customizationSummary?: string | null;
  customizationImageUrl?: string;
}

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

  // Extract product slug for fetching
  const productSlug = isAuthenticated
    ? (item as CartItem).product.slug
    : (item as LocalCartItem).productSlug || null;

  // Fetch product data (we need this for images and details)
  const { data: productData, isLoading: isLoadingProduct } = useProduct(
    productSlug || "",
    { enabled: !!productSlug }
  );

  // Process item data
  const displayData = useMemo((): CartItemDisplayData | null => {
    if (isAuthenticated) {
      const cartItem = item as CartItem;
      const variant = productData?.variants?.find(
        (v) => v.id === cartItem.variant?.id
      );

      // Determine which image to show
      let imageUrl = "/image/error.png";
      
      if (cartItem.customization) {
        // Show customization preview (S3 URL for authenticated users)
        imageUrl = cartItem.customization.previewImageUrl;
      } else if (variant?.images && variant.images.length > 0) {
        // Show variant's primary image or first image
        const primaryImage = variant.images.find((img) => img.isPrimary);
        imageUrl = primaryImage?.imageUrl || variant.images[0].imageUrl;
      }

      return {
        productName: cartItem.product.name,
        productSlug: cartItem.product.slug,
        variantColor: cartItem.variant?.color || "N/A",
        variantSize: cartItem.variant?.size || "N/A",
        imageUrl,
        unitPrice: cartItem.unitPrice + (cartItem.customizationPrice || 0),
        quantity: cartItem.quantity,
        itemTotal: cartItem.itemTotal,
        hasCustomization: !!cartItem.customization,
        customizationSummary: cartItem.customizationSummary,
        customizationImageUrl: cartItem.customization?.previewImageUrl,
      };
    } else {
      // Guest user - local cart item
      const localItem = item as LocalCartItem;
      
      // Find the variant from fetched product data
      const variant = productData?.variants?.find(
        (v) => v.id === localItem.variantId
      );

      // Determine which image to show
      let imageUrl = "/image/error.png";
      
      if (localItem.customizationData?.previewImageBase64) {
        // Show customization preview (base64 for guests)
        imageUrl = `${localItem.customizationData.previewImageBase64}`;
      } else if (variant?.images && variant.images.length > 0) {
        // Show variant's primary image or first image
        const primaryImage = variant.images.find((img) => img.isPrimary);
        imageUrl = primaryImage?.imageUrl || variant.images[0].imageUrl;
      }

      // Calculate prices if we have product data
      const basePrice = productData?.basePrice || 0;
      const variantPrice = variant?.additionalPrice || 0;
      const unitPrice = basePrice + variantPrice;
      const itemTotal = unitPrice * localItem.quantity;
      
      return {
        productName: productData?.name || "Loading...",
        productSlug: localItem.productSlug || "",
        variantColor: variant?.color || "N/A",
        variantSize: variant?.size || "N/A",
        imageUrl,
        unitPrice,
        quantity: localItem.quantity,
        itemTotal,
        hasCustomization: !!localItem.customizationData || !!localItem.customizationId,
        customizationSummary: localItem.customizationSummary,
        customizationImageUrl: localItem.customizationData?.previewImageBase64
          ? `data:image/png;base64,${localItem.customizationData.previewImageBase64}`
          : undefined,
      };
    }
  }, [item, isAuthenticated, productData]);

  if (!displayData || (isAuthenticated && isLoadingProduct)) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-6">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
        <Image
          src={displayData.imageUrl}
          alt={displayData.productName}
          fill
          className="object-cover"
          sizes="96px"
        />
        {displayData.hasCustomization && (
          <div className="absolute right-1 top-1 rounded-full bg-purple-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
            Custom
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        {/* Title & Remove */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {displayData.productSlug ? (
              <Link
                href={`/products/${displayData.productSlug}`}
                className="font-medium hover:underline"
              >
                {displayData.productName}
              </Link>
            ) : (
              <div className="font-medium">{displayData.productName}</div>
            )}
            <p className="text-sm text-muted-foreground">
              {displayData.variantColor} • {displayData.variantSize}
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

        {/* Customization Info */}
        {displayData.hasCustomization && displayData.customizationSummary && (
          <div className="mt-2 rounded-md bg-purple-50 px-2 py-1.5 text-xs text-purple-700">
            🎨 {displayData.customizationSummary}
          </div>
        )}

        {/* Price & Quantity */}
        <div className="mt-auto flex items-end justify-between gap-4">
          {/* Quantity Controls */}
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
              {displayData.quantity}
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

          {/* Price */}
          <div className="text-right">
            <div className="font-semibold">
              ₹{displayData.itemTotal.toFixed(2)}
            </div>
            {displayData.quantity > 1 && (
              <div className="text-xs text-muted-foreground">
                ₹{displayData.unitPrice.toFixed(2)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CART PAGE
// ============================================================================

export default function CartPage() {
  const cart = useCartManager();
  const router = useRouter();
  const [itemToRemove, setItemToRemove] = useState<{
    item: CartItem | LocalCartItem;
    identifier: CartItemIdentifier;
  } | null>(null);

  // Calculate totals
  const { subtotal, shippingCost, tax, total, savingsNeeded } = useMemo(() => {
    // For guests, we need to calculate from individual items
    // For authenticated users, use the cart total from the server
    const sub = cart.isAuthenticated
      ? cart.items.reduce((sum, item) => sum + (item as CartItem).itemTotal, 0)
      : 0; // Guest subtotal calculated below

    // For guests, calculate subtotal from displayed items
    // Note: This is a temporary calculation - actual prices will be determined at checkout
    const guestSubtotal = !cart.isAuthenticated
      ? cart.items.reduce((sum, item) => {
          const localItem = item as LocalCartItem;
          // This is an estimate - we'll show "Calculated at checkout" for final totals
          return sum;
        }, 0)
      : 0;

    const finalSubtotal = cart.isAuthenticated ? sub : guestSubtotal;
    const shipping = finalSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const taxAmount = finalSubtotal * GST_RATE;
    const totalAmount = cart.isAuthenticated ? cart.total : finalSubtotal + shipping + taxAmount;
    const savings = Math.max(0, SHIPPING_THRESHOLD - finalSubtotal);

    return {
      subtotal: finalSubtotal,
      shippingCost: shipping,
      tax: taxAmount,
      total: totalAmount,
      savingsNeeded: savings,
    };
  }, [cart.items, cart.isAuthenticated, cart.total]);

  const createItemIdentifier = (item: CartItem | LocalCartItem): CartItemIdentifier => {
    if (cart.isAuthenticated) {
      const cartItem = item as CartItem;
      return {
        itemId: cartItem.id,
        productId: cartItem.product.id,
        variantId: cartItem.variant?.id || "",
        customizationId: cartItem.customization?.id,
      };
    } else {
      const localItem = item as LocalCartItem;
      return {
        productId: localItem.productId,
        variantId: localItem.variantId,
        customizationId: localItem.customizationId || undefined,
        designId: localItem.customizationData?.designId,
        threadColorHex: localItem.customizationData?.threadColorHex,
      };
    }
  };

  const handleRemoveItem = async () => {
    if (!itemToRemove) return;
    await cart.removeItem(itemToRemove.identifier);
    setItemToRemove(null);
  };

  // Loading state
  if (cart.isLoading) {
    return <CartPageSkeleton />;
  }

  // Empty cart
  if (cart.isEmpty) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </p>
        <Button
          onClick={() => router.push("/products")}
          size="lg"
          className="mt-8 gap-2"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* Free Shipping Banner */}
      {savingsNeeded > 0 && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          <Truck className="mr-2 inline h-4 w-4" />
          Add ₹{savingsNeeded.toFixed(0)} more to get <strong>FREE SHIPPING</strong>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card">
            <div className="divide-y">
              {cart.items.map((item, index) => {
                const identifier = createItemIdentifier(item);
                const key = cart.isAuthenticated
                  ? (item as CartItem).id
                  : `${(item as LocalCartItem).productId}-${(item as LocalCartItem).variantId}-${index}`;

                return (
                  <div key={key} className="px-6">
                    <CartItemRow
                      item={item}
                      isAuthenticated={cart.isAuthenticated}
                      onRemove={() => setItemToRemove({ item, identifier })}
                      onIncrement={() => cart.incrementQuantity(identifier)}
                      onDecrement={() => cart.decrementQuantity(identifier)}
                      isUpdating={cart.isUpdating}
                      isRemoving={cart.isRemoving}
                    />
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="border-t p-6">
              <Button
                variant="outline"
                onClick={() => router.push("/products")}
                className="w-full gap-2 md:w-auto"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-lg border bg-card p-6 sticky top-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {cart.isAuthenticated ? `₹${subtotal.toFixed(2)}` : "Calculated at checkout"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : cart.isAuthenticated ? (
                    `₹${shippingCost.toFixed(2)}`
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span className="font-medium">
                  {cart.isAuthenticated ? `₹${tax.toFixed(2)}` : "Calculated at checkout"}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  {cart.isAuthenticated ? `₹${total.toFixed(2)}` : "Calculated at checkout"}
                </span>
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
                Sign in at checkout to see final pricing
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
  );
}