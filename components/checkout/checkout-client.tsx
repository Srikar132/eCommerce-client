"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/tanstack/queries/cart.queries";
import { useUserAddresses } from "@/lib/tanstack/queries/address.queries";
import { checkout } from "@/lib/actions/order-actions";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoginRequired } from "@/components/auth/login-required";
import { ShoppingBag, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import AddressSelectionCard from "./address-selection-card";
import CheckoutOrderSummary from "./checkout-order-summary";

export default function CheckoutClient() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data: cart, isLoading: isCartLoading } = useCart({ enabled: !!session });
    const { data: addresses, isLoading: isAddressesLoading } = useUserAddresses();

    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [orderNotes, setOrderNotes] = useState<string>("");

    const isAuthenticated = status === "authenticated";
    const isLoading = isCartLoading || isAddressesLoading;

    // Use Razorpay checkout hook
    // With payment-first flow: no order exists until payment succeeds
    // On failure/cancel, user stays on checkout page (no redirect)
    const { openCheckout, isProcessing, isRazorpayLoaded } = useRazorpayCheckout({
        onSuccess: (orderNumber) => {
            router.push(`/orders/${orderNumber}`);
        },
        // No redirect on failure/cancel - user stays on checkout to retry
        clearCartOnSuccess: true,
    });


    // Auto-select default address
    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedAddressId) {
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            } else {
                setSelectedAddressId(addresses[0].id);
            }
        }
    }, [addresses, selectedAddressId]);

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        try {
            // Create order and get Razorpay details
            const checkoutData = await checkout({
                shippingAddressId: selectedAddressId,
                billingAddressId: selectedAddressId,
                notes: orderNotes.trim() || undefined, // Pass notes if provided
            });

            // Open Razorpay checkout using the hook
            openCheckout(checkoutData);
        } catch (error: any) {
            toast.error(error.message || "Checkout failed");
        }
    };

    // Not authenticated
    if (status === "loading" || !isAuthenticated) {
        return (
            <LoginRequired
                title="Login Required"
                description="Please log in to proceed with checkout."
            />
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    // Empty cart (should redirect, but show message just in case)
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">
                        Add items to your cart to proceed with checkout
                    </p>
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // No addresses
    if (!addresses || addresses.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h2 className="text-2xl font-semibold mb-2">No delivery address found</h2>
                    <p className="text-muted-foreground mb-6">
                        Please add a delivery address to continue
                    </p>
                    <Button asChild>
                        <Link href="/account/addresses">Add Address</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
                    <p className="text-sm text-muted-foreground">
                        Complete your order in a few simple steps
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left: Address Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Delivery Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                                    {addresses.map((address) => (
                                        <AddressSelectionCard
                                            key={address.id}
                                            address={address}
                                            isSelected={selectedAddressId === address.id}
                                            onSelect={() => setSelectedAddressId(address.id)}
                                        />
                                    ))}
                                </RadioGroup>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/account">
                                        Manage Addresses
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Order Items Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Order Items ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {cart.items.slice(0, 3).map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            {item.product.primaryImageUrl && (
                                                <img
                                                    src={item.product.primaryImageUrl}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.variant.color} • {item.variant.size} • Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-medium text-sm">
                                                ₹{item.itemTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                    {cart.items.length > 3 && (
                                        <p className="text-xs text-muted-foreground text-center pt-2">
                                            + {cart.items.length - 3} more {cart.items.length - 3 === 1 ? 'item' : 'items'}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Order Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="order-notes" className="text-sm text-muted-foreground">
                                        Add any special instructions for your order (optional)
                                    </Label>
                                    <Textarea
                                        id="order-notes"
                                        placeholder="E.g., Gift wrap, delivery instructions, customization requests..."
                                        value={orderNotes}
                                        onChange={(e) => setOrderNotes(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {orderNotes.length}/500 characters
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <CheckoutOrderSummary
                            cart={cart}
                            onCheckout={handleCheckout}
                            isProcessing={isProcessing}
                            isAddressSelected={!!selectedAddressId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
