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
    return (
        <div className="space-y-3">
            <Badge variant="secondary" className="text-xs font-medium tracking-wide uppercase">
                {brand}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground tracking-tight">
                {name}
            </h1>
        </div>
    );
}