"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface OrderItemCardProps {
    item: {
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
    };
}

export function OrderItemCard({ item }: OrderItemCardProps) {
    return (
        <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
            {/* Product Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <span className="text-xs">No image</span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <Link
                        href={`/products/${item.productSlug}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                        {item.productName}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Color: {item.color}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs rounded-lg">
                        Qty: {item.quantity}
                    </Badge>
                    <Badge
                        variant={item.productionStatus === "COMPLETED" ? "default" : "secondary"}
                        className="text-xs rounded-lg"
                    >
                        {item.productionStatus}
                    </Badge>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end justify-between">
                <span className="font-semibold text-emerald-400">₹{item.totalPrice.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                    ₹{item.unitPrice.toLocaleString()} × {item.quantity}
                </span>
            </div>
        </div>
    );
}
