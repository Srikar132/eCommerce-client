// src/components/product/ProductFeatures.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProductFeature {
    id: string;
    text: string;
}

interface ProductFeaturesProps {
    features: ProductFeature[];
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
    if (!features || features.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Key Features</h3>
            <ul className="space-y-2">
                {features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}