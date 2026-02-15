"use client";

import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderItemCard } from "./order-item-card";

// ============================================================================
// TYPES
// ============================================================================

interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    variantId: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productionStatus: string;
    imageUrl?: string | null;
}

interface OrderItemsListProps {
    items: OrderItem[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderItemsList({ items }: OrderItemsListProps) {
    return (
        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <Package className="h-4 w-4 text-white" />
                    </div>
                    Order Items
                    <Badge variant="secondary" className="ml-2 rounded-full px-3">
                        {items.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 divide-y divide-border">
                {items.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                ))}
            </CardContent>
        </Card>
    );
}
