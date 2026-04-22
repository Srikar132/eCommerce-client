"use client";

import { Cart } from "@/types/cart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CustomButton2 from "@/components/ui/custom-button-2";

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
        <Card className="lg:sticky lg:top-24 bg-accent/5 rounded-[32px] border-border/10 shadow-none overflow-hidden">
            <CardHeader className="p-6 pb-2 space-y-1">
                <CardTitle className="text-xl font-bold tracking-tight">Order Summary</CardTitle>
                <CardDescription className="text-[10px] text-muted-foreground tracking-wide uppercase font-bold opacity-60">
                    Final totals including taxes & shipping
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Subtotal
                        </span>
                        <span className="font-bold tracking-tight">₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax (GST 18%)</span>
                        <span className="font-bold tracking-tight">₹{taxAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Shipping</span>
                            {shippingCost === 0 && (
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Complimentary</span>
                            )}
                        </div>
                        {shippingCost === 0 ? (
                            <span className="font-bold text-accent uppercase tracking-widest text-[10px]">Free</span>
                        ) : (
                            <span className="font-bold tracking-tight">₹{shippingCost.toFixed(2)}</span>
                        )}
                    </div>

                    {subtotal < 1000 && shippingCost > 0 && (
                        <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20 mt-2">
                            <p className="text-[10px] font-medium text-foreground/70 leading-relaxed">
                                Add <span className="font-bold">₹{(1000 - subtotal).toLocaleString()}</span> more for <span className="italic">complimentary delivery</span>.
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border/20">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold tracking-tight">Total</span>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold tracking-tighter">₹{total.toLocaleString()}</span>
                                <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Net Payable</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Place Order Button */}
                <div className="space-y-3 pt-2">
                    <CustomButton2
                        onClick={onCheckout}
                        disabled={!isAddressSelected || isProcessing}
                        bgColor="#000000"
                        fillColor="#ffffff"
                        textColor="#ffffff"
                        textHoverColor="#000000"
                        className="w-full h-14"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] italic">Processing...</span>
                            </div>
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                Place Order <ArrowRight size={16} />
                            </span>
                        )}
                    </CustomButton2>

                    {!isAddressSelected && (
                        <div className="flex items-center justify-center gap-2 py-1">
                            <div className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-destructive/80">
                                Select Delivery Address
                            </p>
                        </div>
                    )}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2.5 py-3 bg-background/40 rounded-2xl border border-border/5">
                    <ShieldCheck size={12} className="text-muted-foreground/30" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Secure White-glove Checkout</span>
                </div>
            </CardContent>
        </Card>
    );
}

function ArrowRight({ size = 20, className = "" }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

function ShieldCheck({ size = 20, className = "" }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
