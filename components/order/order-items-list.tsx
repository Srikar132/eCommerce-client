"use client";

import { OrderItem } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import Link from "next/link";

interface OrderItemsListProps {
    items: OrderItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
    const getProductionStatusVariant = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "default";
            case "IN_PROGRESS":
                return "secondary";
            case "PENDING":
                return "outline";
            default:
                return "outline";
        }
    };

    const formatProductionStatus = (status: string) => {
        return status.replace(/_/g, " ");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                            {/* Product Image */}
                            {item.imageUrl ? (
                                <Link href={`/products/${item.productSlug}`}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded border hover:opacity-80 transition-opacity"
                                    />
                                </Link>
                            ) : (
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded border flex items-center justify-center">
                                    <Package className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.productSlug}`}>
                                    <h3 className="font-medium text-sm md:text-base hover:underline truncate">
                                        {item.productName}
                                    </h3>
                                </Link>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                        {item.color}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Size: {item.size}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        Qty: {item.quantity}
                                    </Badge>
                                </div>

                                {/* Production Status */}
                                <div className="mt-2">
                                    <Badge variant={getProductionStatusVariant(item.productionStatus)} className="text-xs">
                                        {formatProductionStatus(item.productionStatus)}
                                    </Badge>
                                </div>

                                {/* Customization Note */}
                                {item.hasCustomization && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        ✨ Customized product
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                                <p className="font-medium text-sm md:text-base">
                                    ₹{item.totalPrice.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ₹{item.unitPrice.toFixed(2)} each
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
