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
        <div className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h4 className="font-medium text-sm">{title}</h4>
            </div>
            <div className="space-y-1 text-sm">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-muted-foreground">{address.phone}</p>
                <p className="text-muted-foreground">{address.addressLine1}</p>
                {address.addressLine2 && (
                    <p className="text-muted-foreground">{address.addressLine2}</p>
                )}
                <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-muted-foreground">{address.country}</p>
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
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <MapPin className="h-4 w-4 text-white" />
                    </div>
                    Addresses
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    {shippingAddress && (
                        <AddressCard
                            address={shippingAddress}
                            title="Shipping Address"
                            icon={<Home className="h-4 w-4 text-muted-foreground" />}
                        />
                    )}
                    {billingAddress && (
                        <AddressCard
                            address={billingAddress}
                            title="Billing Address"
                            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
