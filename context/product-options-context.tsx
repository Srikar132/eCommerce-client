"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { Product } from "@/types/product";

// ============================================================================
// TYPES
// ============================================================================

export interface ProductOptionsContextValue {
    isOpen: boolean;
    selectedProduct: Product | null;
    openOptions: (product: Product) => void;
    closeOptions: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ProductOptionsContext = createContext<ProductOptionsContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function ProductOptionsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openOptions = useCallback((product: Product) => {
        setSelectedProduct(product);
        setIsOpen(true);
    }, []);

    const closeOptions = useCallback(() => {
        setIsOpen(false);
        // delay clearing so exit animation plays
        setTimeout(() => setSelectedProduct(null), 400);
    }, []);

    return (
        <ProductOptionsContext.Provider value={{ isOpen, selectedProduct, openOptions, closeOptions }}>
            {children}
        </ProductOptionsContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useProductOptions(): ProductOptionsContextValue {
    const ctx = useContext(ProductOptionsContext);
    if (!ctx) {
        throw new Error("useProductOptions must be used inside <ProductOptionsProvider>");
    }
    return ctx;
}
