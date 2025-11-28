// src/components/product/ProductInfo.tsx
"use client";

import React from "react";

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
        <div className="pdp-product-info">
            <p className="pdp-brand">{brand}</p>
            <h1 className="pdp-title">{name}</h1>
            <p className="pdp-price">{formatPrice(price, currency)}</p>
        </div>
    );
}