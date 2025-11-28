// src/components/product/ProductFeatures.tsx
"use client";

import React from "react";
import { ProductFeature } from "@/lib/types";

interface ProductFeaturesProps {
    features: ProductFeature[];
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
    if (!features || features.length === 0) return null;

    return (
        <ul className="pdp-features-list">
            {features.map((feature) => (
                <li key={feature.id} className="pdp-feature-item">
                    {feature.text}
                </li>
            ))}
        </ul>
    );
}