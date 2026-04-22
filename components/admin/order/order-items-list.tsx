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
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 shadow-sm border border-blue-500/10">
                        <Package className="h-5 w-5" />
                    </div>
                    Order Items
                    <Badge variant="secondary" className="ml-auto rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-600 border-0">
                        {items.length} {items.length === 1 ? "Item" : "Items"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/30">
                {items.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                ))}
            </CardContent>
        </Card>
    );
}
