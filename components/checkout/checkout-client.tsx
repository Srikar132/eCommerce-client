"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserAddresses } from "@/lib/tanstack/queries/address.queries";
import { checkout } from "@/lib/actions/order-actions";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { toast } from "sonner";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { LoginRequired } from "@/components/auth/login-required";
import { ShoppingBag, MessageSquare, ChevronRight, MapPin, Package, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AddressSelectionCard from "./address-selection-card";
import CheckoutOrderSummary from "./checkout-order-summary";
import { useCartContext } from "@/context/cart-context";
import CustomButton from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";
import { Cart } from "@/types/cart";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutClient() {
    const router = useRouter();
    const { status } = useSession();

    // ── Use the unified Cart Context ──────────────────────────────────────
    const {
        items,
        totalItems,
        subtotal,
        discountAmount,
        total,
        isLoading: isCartLoading,
    } = useCartContext();

    const { data: addresses, isLoading: isAddressesLoading } = useUserAddresses();

    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [orderNotes, setOrderNotes] = useState<string>("");

    const isAuthenticated = status === "authenticated";
    const isLoading = isCartLoading || isAddressesLoading;

    // Use Razorpay checkout hook
    const { openCheckout, isProcessing } = useRazorpayCheckout({
        onSuccess: (orderNumber) => {
            toast.success("Payment successful! Redirecting to your order...", {
                icon: <div className="bg-black rounded-full p-1"><Package className="w-3 h-3 text-white" /></div>,
                duration: 3000,
            });
            setTimeout(() => {
                router.push(`/orders/${orderNumber}`);
            }, 1000);
        },
        clearCartOnSuccess: true,
    });

    // Auto-select default address
    const defaultAddressId = addresses?.find(addr => addr.isDefault)?.id ?? addresses?.[0]?.id;
    useEffect(() => {
        if (defaultAddressId && !selectedAddressId) {
            setSelectedAddressId(defaultAddressId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultAddressId]);

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        try {
            const checkoutData = await checkout({
                shippingAddressId: selectedAddressId,
                billingAddressId: selectedAddressId,
                notes: orderNotes.trim() || undefined,
            });

            openCheckout(checkoutData);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Checkout failed", {
                icon: <div className="bg-destructive rounded-full p-1"><CreditCard className="w-3 h-3 text-white" /></div>,
            });
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

    // Loading state (Skeleton)
    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="mb-12 space-y-4">
                    <Skeleton className="h-4 w-24 bg-foreground/5 rounded-full" />
                    <Skeleton className="h-16 md:h-24 w-64 md:w-96 bg-foreground/5 rounded-3xl" />
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-48 bg-foreground/5 rounded-2xl" />
                            <div className="grid gap-4">
                                <Skeleton className="h-32 w-full bg-foreground/5 rounded-[2rem]" />
                                <Skeleton className="h-32 w-full bg-foreground/5 rounded-[2rem]" />
                            </div>
                        </div>
                        <Skeleton className="h-64 w-full bg-foreground/5 rounded-[2rem]" />
                    </div>
                    <div className="lg:col-span-1">
                        <Skeleton className="h-[500px] w-full bg-foreground/5 rounded-[2rem]" />
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart
    if (!items || items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-32 max-w-7xl">
                <div className="flex flex-col items-center justify-center text-center space-y-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl scale-150 transition-transform duration-500 group-hover:scale-[2]" />
                        <div className="relative w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                            <ShoppingBag className="w-12 h-12 text-foreground" strokeWidth={1.5} />
                            <div className="absolute top-0 right-0 w-4 h-4 bg-black rounded-full animate-ping" />
                        </div>
                    </div>
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">
                            Empty Basket
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Your curation is currently empty. Explore our latest pieces to add them to your collection.
                        </p>
                    </div>
                    <CustomButton
                        href="/products"
                        bgColor="#000000"
                        circleColor="#ffffff"
                        textColor="#ffffff"
                        textHoverColor="#000000"
                        circleSize={52}
                        className="h-16 px-10 text-lg"
                    >
                        Explore Gallery
                    </CustomButton>
                </div>
            </div>
        );
    }

    // No addresses
    if (!addresses || addresses.length === 0) {
        return (
            <div className="container mx-auto px-6 py-32 max-w-7xl">
                <div className="flex flex-col items-center justify-center text-center space-y-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl scale-150 transition-transform duration-500 group-hover:scale-[2]" />
                        <div className="relative w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                            <MapPin className="w-12 h-12 text-foreground" strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">
                            Delivery Destination
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We need a destination to send your handcrafted pieces. Please add a delivery address in your account.
                        </p>
                    </div>
                    <CustomButton
                        href="/account"
                        bgColor="#000000"
                        circleColor="#ffffff"
                        textColor="#ffffff"
                        textHoverColor="#000000"
                        circleSize={52}
                        className="h-16 px-10 text-lg"
                    >
                        Add Address
                    </CustomButton>
                </div>
            </div>
        );
    }

    // Build a Cart-shaped object for CheckoutOrderSummary from context values
    const cartForSummary: Cart = {
        id: "ctx",
        items,
        totalItems,
        subtotal,
        discountAmount,
        total,
        createdAt: "",
        updatedAt: "",
    };

    return (
        <div>
            {/* Header */}
            {/* <div className="mb-20 space-y-6">
                <div className="flex items-center gap-4">
                    <span className="w-12 h-[1px] bg-foreground/10" />
                    <span className="p-xs font-medium uppercase tracking-[0.4em] text-foreground/30">
                        Final steps
                    </span>
                </div>
                <h2 className="italic leading-tight">
                    Checkout.
                </h2>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Address + Items + Notes */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Delivery Address */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between pb-4 border-b border-foreground/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <MapPin size={16} className="text-foreground/60" />
                                </div>
                                <h3 className="tracking-normal font-bold">Shipping</h3>
                            </div>
                            <Link
                                href="/account"
                                className="group flex items-center gap-2 p-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-black transition-colors"
                            >
                                Manage
                                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="grid gap-4">
                            {addresses.map((address) => (
                                <AddressSelectionCard
                                    key={address.id}
                                    address={address}
                                    isSelected={selectedAddressId === address.id}
                                    onSelect={() => setSelectedAddressId(address.id)}
                                />
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Order Items Preview */}
                    <div className="bg-white border border-foreground/5 rounded-[2rem] p-content shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <Package size={16} className="text-foreground/60" />
                                </div>
                                <h4 className="tracking-normal font-bold">
                                    Review Items
                                </h4>
                            </div>
                            <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent p-xs font-black uppercase tracking-widest">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            {items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 group">
                                    {item.product.primaryImageUrl && (
                                        <div className="relative w-full sm:w-24 h-48 sm:h-24 shrink-0 overflow-hidden rounded-2xl sm:rounded-[2rem] bg-foreground/[0.02] border border-foreground/[0.03]">
                                            <Image
                                                src={item.product.primaryImageUrl}
                                                alt={item.product.name}
                                                fill
                                                sizes="96px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="p-base font-bold tracking-normal truncate leading-relaxed group-hover:text-accent transition-colors">
                                            {item.product.name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                                {item.variant.color}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                                {item.variant.size}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
                                        <p className="p-base font-bold tracking-tight">
                                            ₹{item.itemTotal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {items.length > 3 && (
                                <Link
                                    href="/cart"
                                    className="flex items-center justify-center gap-2 py-5 text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-black transition-colors bg-foreground/[0.02] rounded-2xl hover:bg-foreground/[0.05]"
                                >
                                    + {items.length - 3} more {items.length - 3 === 1 ? 'item' : 'items'}
                                    <ChevronRight size={12} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Order Notes */}
                    <div className="bg-white border border-foreground/5 rounded-[2rem] p-content shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                                <MessageSquare size={16} className="text-foreground/60" />
                            </div>
                            <h4 className="tracking-normal font-bold">Special Requests</h4>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[13px] font-medium text-foreground/40 leading-relaxed max-w-md">
                                Add any special instructions or customization requests for your order. We&apos;ll do our best to accommodate them.
                            </p>
                            <div className="relative">
                                <Textarea
                                    id="order-notes"
                                    placeholder="E.g., Gift wrap, delivery instructions..."
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    rows={4}
                                    maxLength={500}
                                    className="resize-none rounded-[1.5rem]  border-foreground/5 focus:bg-white focus:ring-black/5 transition-all p-8 text-base placeholder:text-foreground/20"
                                />
                                <div className="absolute bottom-6 right-8">
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest",
                                        orderNotes.length > 450 ? "text-destructive" : "text-foreground/20"
                                    )}>
                                        {orderNotes.length} / 500
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <CheckoutOrderSummary
                            cart={cartForSummary}
                            onCheckout={handleCheckout}
                            isProcessing={isProcessing}
                            isAddressSelected={!!selectedAddressId}
                        />

                        {/* Trust Badges */}
                        <div className="px-8 flex flex-col gap-4">
                            <div className="flex items-center gap-3 opacity-40">
                                <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                                    <ShieldCheck size={12} />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest">Encrypted Checkout</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-40">
                                <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                                    <Package size={12} />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest">White-glove Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
                    <div className="space-y-6 max-w-sm">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-foreground/5 rounded-full" />
                            <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <CreditCard className="w-8 h-8 text-black" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="italic">Securing Order</h3>
                            <p className="p-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                Please do not refresh or close this window while we finalize your payment...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
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
