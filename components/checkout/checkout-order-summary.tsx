"use client";

import { Cart } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldCheck } from "lucide-react";

interface CheckoutOrderSummaryProps {
    cart: Cart;
    onCheckout: () => void;
    isProcessing: boolean;
    isAddressSelected: boolean;
}

export default function CheckoutOrderSummary({
    cart,
    onCheckout,
    isProcessing,
    isAddressSelected,
}: CheckoutOrderSummaryProps) {
    const subtotal = cart.subtotal || 0;
    const taxAmount = subtotal * 0.18; // 18% GST
    const shippingCost = subtotal >= 1000 ? 0 : 100;
    const total = subtotal + taxAmount + shippingCost;

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                            Subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
                        </span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tax (GST 18%)</span>
                        <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        {shippingCost === 0 ? (
                            <span className="font-medium text-green-600">FREE</span>
                        ) : (
                            <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
                        )}
                    </div>

                    {subtotal < 1000 && shippingCost > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
                        </p>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between text-base pt-1">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Place Order Button */}
                <Button
                    onClick={onCheckout}
                    disabled={!isAddressSelected || isProcessing}
                    className="w-full"
                    size="lg"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        `Place Order • ₹${total.toFixed(2)}`
                    )}
                </Button>

                {!isAddressSelected && (
                    <p className="text-xs text-destructive text-center">
                        Please select a delivery address
                    </p>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure checkout powered by Razorpay</span>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    <p>• Tax calculated based on delivery address</p>
                    <p>• You can pay using UPI, Cards, NetBanking</p>
                    <p>• 7-day return policy available</p>
                </div>
            </CardContent>
        </Card>
    );
}
