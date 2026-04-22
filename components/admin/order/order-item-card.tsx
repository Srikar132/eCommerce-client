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
        <div className="flex gap-5 p-6 hover:bg-muted/30 transition-colors group">
            {/* Product Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted border border-border/40 shadow-sm group-hover:scale-105 transition-transform">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider">No image</span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                    <Link
                        href={`/admin/products/${item.productId}/edit`}
                        className="text-base font-bold text-foreground/90 hover:text-primary transition-colors line-clamp-1"
                    >
                        {item.productName}
                    </Link>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded-full">Size: {item.size}</span>
                        <span className="bg-muted px-2 py-0.5 rounded-full">Color: {item.color}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 border-border/60">
                        Qty: {item.quantity}
                    </Badge>
                    <Badge
                        variant={item.productionStatus === "COMPLETED" ? "default" : "secondary"}
                        className="text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 border-0"
                    >
                        {item.productionStatus}
                    </Badge>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end justify-between py-1">
                <div className="text-right">
                    <p className="text-lg font-black text-foreground">₹{item.totalPrice.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                        ₹{item.unitPrice.toLocaleString()} per unit
                    </p>
                </div>
                {item.quantity > 1 && (
                    <p className="text-[10px] font-medium text-muted-foreground italic">
                        Multiple units included
                    </p>
                )}
            </div>
        </div>
    );
}
