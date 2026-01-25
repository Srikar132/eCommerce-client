// src/components/product/ProductFeatures.tsx
"use client";

import React from "react";

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
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-6">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {features.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-3">
                        <span className="material-icons-outlined text-primary text-lg">check_circle_outline</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}