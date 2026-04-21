"use client";

import { Cart } from "@/types/cart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        <Card className="sticky top-24  overflow-hidden">
            <CardHeader className="pb-6 ">
                <h4 className="italic tracking-normal font-black">Summary.</h4>
            </CardHeader>
            <CardContent>
                {/* Price Breakdown */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-base  tracking-[0.2em] font-medium">
                            Subtotal
                        </span>
                        <span className="p-base font-bold">₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className=" text-muted-foreground uppercase tracking-[0.2em] font-medium">Tax (GST 18%)</span>
                        <span className=" font-bold">₹{taxAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <span className=" text-muted-foreground uppercase tracking-[0.2em] font-medium">Shipping</span>
                            {shippingCost === 0 && (
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Complimentary</span>
                            )}
                        </div>
                        {shippingCost === 0 ? (
                            <span className="p-base font-bold text-accent italic">Free</span>
                        ) : (
                            <span className="p-base font-bold">₹{shippingCost.toFixed(2)}</span>
                        )}
                    </div>

                    {subtotal < 1000 && shippingCost > 0 && (
                        <div className="bg-secondary/20 p-6 rounded-[1.5rem] border border-secondary/30">
                            <p className="p-xs font-medium text-foreground/70 leading-relaxed">
                                Add <span className="font-bold text-foreground">₹{(1000 - subtotal).toLocaleString()}</span> more to unlock <span className="italic">complimentary delivery</span>.
                            </p>
                        </div>
                    )}

                    <div className="pt-4">
                        <div className="h-[1px] w-full bg-foreground/[0.08]" />
                    </div>

                    <div className="flex items-end justify-between">
                        <span className="font-bold  text-muted-foreground">Total</span>
                        <div className="flex flex-col items-end">
                            <h3 className="italic font-black text-xl">₹{total.toLocaleString()}</h3>
                            <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em] mt-2">Net Payable</span>
                        </div>
                    </div>
                </div>

                {/* Place Order Button */}
                <div className="pt-4">
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
                                <span className="p-base italic">Processing...</span>
                            </div>
                        ) : (
                            <span className="p-base font-bold flex items-center gap-2">
                                Place Order <ArrowRight size={18} />
                            </span>
                        )}
                    </CustomButton2>
                </div>

                {!isAddressSelected && (
                    <div className="flex items-center justify-center gap-3 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive/80">
                            Select Delivery Address
                        </p>
                    </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-3 py-4 bg-white/50 rounded-2xl border border-foreground/[0.04] backdrop-blur-sm">
                    <ShieldCheck size={14} className="text-foreground/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20">Secure White-glove Checkout</span>
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
