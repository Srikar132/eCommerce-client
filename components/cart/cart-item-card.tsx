"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { cn, formatCurrency } from "@/lib/utils";

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (cartItemId: string, quantity: number) => void;
    onRemove: (cartItemId: string) => void;
    isUpdating?: boolean;
    isRemoving?: boolean;
    variant?: "default" | "sidebar";
}

export function CartItemCard({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating,
    isRemoving,
    variant = "default"
}: CartItemCardProps) {
    const handleIncrement = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    if (variant === "sidebar") {
        return (
            <div className={cn(
                "flex gap-4 py-4 group",
                (isUpdating || isRemoving) && "opacity-50 pointer-events-none"
            )}>
                {/* Image */}
                <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-[#F0F2F5] shrink-0">
                    <Image
                        src={item.product.primaryImageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-sm text-black leading-tight">
                                {item.product.name}
                            </h3>
                            <div className="text-right shrink-0">
                                <p className="font-bold text-sm text-accent">
                                    {formatCurrency(item.unitPrice)}
                                </p>
                                {item.unitPrice > 0 && (
                                    <p className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
                                        {formatCurrency(item.unitPrice * 1.2)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium">
                            {item.variant.color}, {item.variant.size}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center bg-muted/30 rounded-full border border-black/[0.03] p-1 h-9">
                            <button
                                onClick={handleDecrement}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all disabled:opacity-30"
                            >
                                <Minus size={12} className="text-black" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-black">
                                {item.quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                disabled={isUpdating}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                            >
                                <Plus size={12} className="text-black" />
                            </button>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            disabled={isRemoving}
                            className="text-[11px] font-bold text-muted-foreground hover:text-black underline underline-offset-4 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex gap-4 md:gap-6 p-4 md:p-6 border rounded-[24px] bg-card transition-all",
            (isUpdating || isRemoving) && "opacity-60 pointer-events-none"
        )}>
            {/* Product Image */}
            <Link href={`/products/${item.product.slug}`} className="shrink-0">
                <div className="relative w-20 h-20 md:w-32 md:h-40 rounded-[20px] overflow-hidden bg-[#F0F2F5]">
                    <Image
                        src={item.product.primaryImageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 128px"
                    />
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/products/${item.product.slug}`}
                                className="text-lg md:text-xl font-bold hover:text-accent transition-colors line-clamp-1"
                            >
                                {item.product.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground">
                                    {item.variant.color}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground">
                                    {item.variant.size}
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                             <p className="font-bold text-lg md:text-2xl text-black">
                                {formatCurrency(item.itemTotal)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center bg-muted/20 rounded-full border border-black/[0.03] p-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDecrement}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm transition-all"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-12 text-center text-sm font-bold">
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleIncrement}
                            disabled={isUpdating}
                            className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm transition-all"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        disabled={isRemoving}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-black transition-colors"
                    >
                        <X className="w-4 h-4" />
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
