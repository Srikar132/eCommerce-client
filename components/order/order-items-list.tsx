"use client";

import { OrderItem } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
        <Card className="rounded-3xl border-none shadow-sm bg-muted/20 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-muted-foreground/5 p-content py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <Package className="w-5 h-5 text-accent" />
                    </div>
                    Order Items ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-content pt-6">
                <div className="space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-5 pb-6 border-b border-muted-foreground/5 last:border-b-0 last:pb-0">
                            {/* Product Image */}
                            {item.imageUrl ? (
                                <Link href={`/products/${item.productSlug}`} className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 group">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        fill
                                        sizes="(max-width: 768px) 96px, 128px"
                                        className="object-cover rounded-2xl border-none group-hover:opacity-90 transition-all duration-300 shadow-sm"
                                    />
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset" />
                                </Link>
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-2xl flex items-center justify-center shadow-inner">
                                    <Package className="w-10 h-10 text-muted-foreground/40" />
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <Link href={`/products/${item.productSlug}`}>
                                    <h3 className="h4 hover:text-accent transition-colors truncate mb-1">
                                        {item.productName}
                                    </h3>
                                </Link>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-background/80">
                                        {item.color}
                                    </Badge>
                                    <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-background/80">
                                        Size: {item.size}
                                    </Badge>
                                    <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-background/80">
                                        Qty: {item.quantity}
                                    </Badge>
                                </div>

                                {/* Production Status & Customization */}
                                <div className="flex items-center gap-3 mt-4">
                                    <Badge variant={getProductionStatusVariant(item.productionStatus)} className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                                        {formatProductionStatus(item.productionStatus)}
                                    </Badge>
                                    {item.hasCustomization && (
                                        <span className="p-xs text-accent flex items-center gap-1 font-medium bg-accent/10 px-2 py-0.5 rounded-full">
                                            ✨ Customized
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0 flex flex-col justify-center">
                                <p className="text-xl font-bold text-foreground">
                                    ₹{item.totalPrice.toFixed(2)}
                                </p>
                                <p className="p-xs text-muted-foreground mt-1">
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

