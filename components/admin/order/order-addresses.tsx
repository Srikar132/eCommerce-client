"use client";

import { MapPin, Building2, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================================================
// TYPES
// ============================================================================

interface Address {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

interface OrderAddressesProps {
    shippingAddress?: Address | null;
    billingAddress?: Address | null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface AddressCardProps {
    address: Address;
    title: string;
    icon: React.ReactNode;
}

function AddressCard({ address, title, icon }: AddressCardProps) {
    return (
        <div className="p-5 rounded-2xl bg-muted/10 border border-border/40 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {icon}
                </div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">{title}</h4>
            </div>
            <div className="space-y-1.5 text-sm">
                <p className="font-bold text-foreground/90 text-base">{address.fullName}</p>
                <p className="text-muted-foreground font-medium">{address.phone}</p>
                <div className="pt-2 space-y-1">
                    <p className="text-muted-foreground leading-relaxed">{address.addressLine1}</p>
                    {address.addressLine2 && (
                        <p className="text-muted-foreground leading-relaxed">{address.addressLine2}</p>
                    )}
                    <p className="text-muted-foreground leading-relaxed">
                        {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-muted-foreground font-semibold mt-1">{address.country}</p>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderAddresses({ shippingAddress, billingAddress }: OrderAddressesProps) {
    if (!shippingAddress && !billingAddress) {
        return null;
    }

    return (
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm border border-primary/10">
                        <MapPin className="h-5 w-5" />
                    </div>
                    Addresses
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    {shippingAddress && (
                        <AddressCard
                            address={shippingAddress}
                            title="Shipping Address"
                            icon={<Home className="h-3.5 w-3.5" />}
                        />
                    )}
                    {billingAddress && (
                        <AddressCard
                            address={billingAddress}
                            title="Billing Address"
                            icon={<Building2 className="h-3.5 w-3.5" />}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
