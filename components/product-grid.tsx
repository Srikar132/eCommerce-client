


// components/ProductList.tsx
'use client';
import Image from 'next/image';
import React from 'react';
import { ProductCard } from '../lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProductById } from '@/lib/api';
import ProductCardComponent from './cards/product-card';

type Props = { products: ProductCard[]; showPrefetch?: boolean };

export default function ProductList({ products, showPrefetch }: Props) {
    const qc = useQueryClient();

    const prefetch = (id: string) => {
        if (!showPrefetch) return;
        qc.prefetchQuery({ 
            queryKey: ['product', id], 
            queryFn: () => fetchProductById(id), 
            staleTime: 1000 * 60 * 5 
        });
    };

    if (!products || products.length === 0) {
        return <div className="text-center py-12 text-gray-500">No products found</div>;
    }

    return (
        <div className="product-list">
            {products.map((p) => (
                <ProductCardComponent key={p.id} product={p} onMouseEnter={() => prefetch(p.id)} viewMode='grid'/>
            ))}
        </div>
    );
}
