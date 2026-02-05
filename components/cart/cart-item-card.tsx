"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/types/cart";
import { cn } from "@/lib/utils";

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (cartItemId: string, quantity: number) => void;
    onRemove: (cartItemId: string) => void;
    isUpdating?: boolean;
    isRemoving?: boolean;
}

export function CartItemCard({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating,
    isRemoving,
}: CartItemCardProps) {
    const handleIncrement = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    return (
        <div className={cn(
            "flex gap-4 md:gap-6 p-4 md:p-6 border  bg-card transition-all",
            (isUpdating || isRemoving) && "opacity-60 pointer-events-none"
        )}>
            {/* Product Image */}
            <Link href={`/products/${item.product.slug}`} className="shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden border bg-muted/50">
                    <Image
                        src={item.product.primaryImageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 96px"
                    />
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/products/${item.product.slug}`}
                                className="font-medium hover:text-primary transition-colors line-clamp-2 text-sm md:text-base"
                            >
                                {item.product.name}
                            </Link>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span>Size: <span className="text-foreground font-medium">{item.variant.size}</span></span>
                                <span className="text-muted-foreground/40">•</span>
                                <span>Color: <span className="text-foreground font-medium">{item.variant.color}</span></span>
                            </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(item.id)}
                            disabled={isRemoving}
                            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Price and Quantity */}
                <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDecrement}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="h-8 w-8 rounded-r-none hover:bg-muted"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium border-x">
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleIncrement}
                            disabled={isUpdating}
                            className="h-8 w-8 rounded-l-none hover:bg-muted"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <p className="font-semibold text-base md:text-lg">₹{item.itemTotal.toFixed(2)}</p>
                        {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                                ₹{item.unitPrice.toFixed(2)} each
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
