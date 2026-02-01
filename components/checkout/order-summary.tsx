"use client";

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCartManager } from '@/hooks/use-cart';
import { useProduct } from '@/lib/tanstack/queries/product.queries';
import { useDesign } from '@/lib/tanstack/queries/design.queries';
import type { CartItem } from '@/types';
import type { LocalCartItem } from '@/lib/utils/local-cart';

const SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;
const GST_RATE = 0.1;

interface CartItemDisplayProps {
  item: CartItem | LocalCartItem;
  isAuthenticated: boolean;
}

function CartItemDisplay({ item, isAuthenticated }: CartItemDisplayProps) {
  // Extract identifiers
  const designId = isAuthenticated
    ? (item as CartItem).customization?.designId
    : (item as LocalCartItem).customizationData?.designId;

  // Fetch design data only when needed
  const { data: designData, isLoading: isLoadingDesign } = useDesign(
    designId || ""
  );

  // Handle authenticated user cart item
  if (isAuthenticated) {
    const cartItem = item as CartItem;
    const variant = cartItem.variant;


    // Calculate prices
    const designPrice = designData?.designPrice || 0;
    const unitPrice = cartItem.customization 
      ? cartItem.unitPrice + designPrice 
      : cartItem.unitPrice;
    const itemTotal = unitPrice * cartItem.quantity;

    return (
      <div className="flex gap-3">
        <div className="relative w-16 h-16 bg-muted/30 rounded-lg overflow-hidden shrink-0 border border-border/30">
          <Image
            src={variant?.primaryImageUrl || '/images/image-not-found.webp'}
            alt={cartItem.product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
          <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
            {cartItem.quantity}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">
            {cartItem.product.name}
          </h3>
          <div className="text-xs text-muted-foreground mt-0.5">
            {variant?.size || 'N/A'} • {variant?.color || 'N/A'}
          </div>
          {cartItem.customization && (
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              <span>🎨</span>
              <span className="font-medium">Custom</span>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-sm font-semibold text-foreground">
            ₹{itemTotal.toFixed(2)}
          </div>
        </div>
      </div>
    );
  }

  // Handle guest user cart item
  const localItem = item as LocalCartItem;

  // Show loading state only for design data
  if (designId && isLoadingDesign) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
    );
  }



  // Calculate prices from stored data
  const designPrice = localItem.customizationData?.designPrice || 0;
  const unitPrice = localItem.basePrice + localItem.variantPrice + designPrice;
  const itemTotal = unitPrice * localItem.quantity;

  return (
    <div className="flex gap-3">
      <div className="relative w-16 h-16 bg-muted/30 rounded-lg overflow-hidden shrink-0 border border-border/30">
        <Image
          src={localItem.variantImageUrl || "/image/error.png"}
          alt={localItem.productName}
          fill
          className="object-cover"
          sizes="64px"
        />
        <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
          {localItem.quantity}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">
          {localItem.productName}
        </h3>
        <div className="text-xs text-muted-foreground mt-0.5">
          {localItem.variantSize} • {localItem.variantColor}
        </div>
        {localItem.customizationData && (
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            <span>🎨</span>
            <span className="font-medium">Custom</span>
          </div>
        )}
      </div>
      
      <div className="text-right">
        <div className="text-sm font-semibold text-foreground">
          ₹{itemTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default function OrderSummary() {
  const cart = useCartManager();

  // Calculate totals directly
  const subtotal = cart.isAuthenticated
    ? cart.items.reduce((sum, item) => sum + (item as CartItem).itemTotal, 0)
    : 0;

  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * GST_RATE;
  const total = cart.isAuthenticated ? cart.total : subtotal + shippingCost + tax;

  if (cart.isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (cart.isEmpty) {
    return (
      <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8">
        <p className="text-center text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="px-6 py-4 border-b border-border/30">
        <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
      </div>
      
      {/* Cart Items */}
      <div className="p-6 space-y-4">
        {cart.items.map((item) => {
          const itemKey = cart.isAuthenticated
            ? (item as CartItem).id
            : `${(item as LocalCartItem).productId}-${(item as LocalCartItem).variantId}`;
          
          return (
            <CartItemDisplay
              key={itemKey}
              item={item}
              isAuthenticated={cart.isAuthenticated}
            />
          );
        })}
      </div>

      {/* Discount Code */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Discount code"
            className="flex-1 h-10 text-sm bg-background/50 border-border/50 focus:border-primary"
          />
          <Button 
            variant="outline" 
            className="px-5 h-10 text-sm border-border/50 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Order Totals */}
      <div className="px-6 py-5 border-t border-border/30 space-y-3 bg-muted/20">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-foreground">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST)</span>
          <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-border/30 pt-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
