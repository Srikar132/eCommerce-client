// src/components/product/ProductInfo.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
    brand: string;
    name: string;
    price: number;
    currency: string;
}

export default function ProductInfo({ brand, name, price, currency }: ProductInfoProps) {
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(price);
    };

    return (
        <div className="space-y-3">
            <Badge variant="secondary" className="text-xs font-medium tracking-wide uppercase">
                {brand}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground tracking-tight">
                {name}
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-primary">
                {formatPrice(price, currency)}
            </p>
        </div>
    );
}