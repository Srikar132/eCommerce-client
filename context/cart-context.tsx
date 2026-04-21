"use client";

// ============================================================================
// CART CONTEXT
// Auth-awareness lives HERE and ONLY here.
// Every component calls useCartContext() — no useSession, no branching.
// ============================================================================

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
    ReactNode,
    useState,
} from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    getOrCreateCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart as clearServerCart,
} from "@/lib/actions/cart-actions";
import {
    Cart,
    CartItem,
    VariantSummary,
    ProductSummary,
    GuestCartItem,
    UnifiedCartSource,
} from "@/types/cart";
import { useGuestCartStore } from "@/store/guest-cart.store";
import { queryKeys } from "@/lib/tanstack/query-keys";

// ============================================================================
// TYPES
// ============================================================================

export interface AddToCartPayload {
    productId: string;
    productVariantId: string;
    quantity?: number;
    unitPrice: number;
    product: ProductSummary;
    variant: VariantSummary;
}

export interface CartContextValue {
    // ── State ──────────────────────────────────────────────────────────────
    source: UnifiedCartSource;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    discountAmount: number;
    total: number;
    isLoading: boolean;
    isFetching: boolean;
    isPending: boolean; // Any mutation in progress
    isAdding: boolean;
    isRemoving: boolean;
    isUpdating: boolean;
    isOpen: boolean;

    // ── Actions ────────────────────────────────────────────────────────────
    openCart: () => void;
    closeCart: () => void;
    addItem: (payload: AddToCartPayload) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;

    // ── Helpers ────────────────────────────────────────────────────────────
    isInCart: (productId: string, productVariantId: string) => boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const CartContext = createContext<CartContextValue | null>(null);

// ============================================================================
// HELPERS
// ============================================================================

/** Map a GuestCartItem → CartItem so consumers always get a unified shape */
function guestItemToCartItem(item: GuestCartItem): CartItem {
    return {
        id: item.localId,
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        itemTotal: item.itemTotal,
        addedAt: item.addedAt,
    };
}

// ============================================================================
// PROVIDER
// ============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
    // ── Auth — resolved ONCE for the entire cart system ───────────────────
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";
    const queryClient = useQueryClient();

    // ── Guest store selectors ─────────────────────────────────────────────
    const guestItems = useGuestCartStore((s) => s.items);
    const guestTotalItems = useGuestCartStore((s) => s.totalItems);
    const guestSubtotal = useGuestCartStore((s) => s.subtotal);
    const guestTotal = useGuestCartStore((s) => s.total);
    const guestAddItem = useGuestCartStore((s) => s.addItem);
    const guestRemoveItem = useGuestCartStore((s) => s.removeItem);
    const guestUpdateQty = useGuestCartStore((s) => s.updateQuantity);
    const guestClearCart = useGuestCartStore((s) => s.clearCart);
    const removeMergedItems = useGuestCartStore((s) => s.removeMergedItems);

    // ── Sidebar State ─────────────────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    // ── Server cart query (only when authenticated) ───────────────────────
    const {
        data: serverCart,
        isLoading: serverLoading,
        isFetching: serverFetching,
    } = useQuery<Cart | null>({
        queryKey: queryKeys.cart.details(),
        queryFn: () => getOrCreateCart(),
        staleTime: 1000 * 60 * 5, // 5 min
        retry: 1,
        enabled: isAuthenticated,
    });

    // ── Mutations ─────────────────────────────────────────────────────────

    const addMutation = useMutation({
        mutationFn: async (payload: AddToCartPayload) => {
            const { productId, productVariantId, quantity = 1, unitPrice, product, variant } = payload;
            if (!isAuthenticated) {
                guestAddItem(productId, productVariantId, quantity, unitPrice, product, variant);
                return null;
            }
            return addItemToCart(productId, productVariantId, quantity);
        },
        onSuccess: (data) => {
            if (data) queryClient.setQueryData(queryKeys.cart.details(), data);
            toast.success("Item added to cart");
            openCart(); // Auto-open on add
        },
        onError: (err: Error) => toast.error(err.message || "Failed to add item"),
    });

    const removeMutation = useMutation({
        mutationFn: async (itemId: string) => {
            if (!isAuthenticated) {
                guestRemoveItem(itemId);
                return null;
            }
            return removeItemFromCart(itemId);
        },
        onSuccess: (data) => {
            if (data) queryClient.setQueryData(queryKeys.cart.details(), data);
            toast.success("Item removed from cart");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to remove item"),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
            if (!isAuthenticated) {
                guestUpdateQty(itemId, quantity);
                return null;
            }
            return updateCartItemQuantity(itemId, quantity);
        },
        onSuccess: (data) => {
            if (data) queryClient.setQueryData(queryKeys.cart.details(), data);
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update quantity"),
    });

    const clearMutation = useMutation({
        mutationFn: async () => {
            if (!isAuthenticated) {
                guestClearCart();
                return;
            }
            return clearServerCart();
        },
        onSuccess: () => {
            if (isAuthenticated) {
                queryClient.invalidateQueries({ queryKey: queryKeys.cart.details() });
            }
            toast.success("Cart cleared");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to clear cart"),
    });

    // ── Stable action callbacks ───────────────────────────────────────────

    const addItem = useCallback(
        (payload: AddToCartPayload) => addMutation.mutate(payload),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAuthenticated]
    );

    const removeItem = useCallback(
        (itemId: string) => removeMutation.mutate(itemId),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAuthenticated]
    );

    const updateQuantity = useCallback(
        (itemId: string, quantity: number) => updateMutation.mutate({ itemId, quantity }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAuthenticated]
    );

    const clearCart = useCallback(
        () => clearMutation.mutate(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAuthenticated]
    );

    const isInCart = useCallback(
        (productId: string, productVariantId: string): boolean => {
            if (isAuthenticated) {
                return (
                    serverCart?.items.some(
                        (item) =>
                            item.product.id === productId &&
                            item.variant.id === productVariantId
                    ) ?? false
                );
            }
            return guestItems.some(
                (item) =>
                    item.productId === productId &&
                    item.productVariantId === productVariantId
            );
        },
        [isAuthenticated, serverCart, guestItems]
    );

    // ── Guest → server merge on login ─────────────────────────────────────
    const [isMerging, setIsMerging] = useState(false);
    const hasMergedRef = useRef(false);

    const merge = useCallback(async () => {
        if (isMerging || hasMergedRef.current || guestItems.length === 0) return;
        
        setIsMerging(true);
        hasMergedRef.current = true;

        try {
            const mergedLocalIds: string[] = [];

            for (const item of guestItems) {
                try {
                    // Use the server action directly
                    const updatedCart = await addItemToCart(item.productId, item.productVariantId, item.quantity);
                    if (updatedCart) {
                        queryClient.setQueryData(queryKeys.cart.details(), updatedCart);
                    }
                    mergedLocalIds.push(item.localId);
                } catch (err) {
                    console.warn(
                        `Cart merge: skipped ${item.product.name} (${item.variant.size}/${item.variant.color}):`,
                        err
                    );
                }
            }

            if (mergedLocalIds.length > 0) {
                removeMergedItems(mergedLocalIds);
                toast.success(
                    `${mergedLocalIds.length} item${mergedLocalIds.length > 1 ? "s" : ""} from your guest cart have been synchronized.`
                );
            }

            const remaining = guestItems.length - mergedLocalIds.length;
            if (remaining === 0) {
                guestClearCart();
            } else if (remaining > 0) {
                toast.warning(
                    `${remaining} item${remaining > 1 ? "s" : ""} could not be merged (out of stock or unavailable).`
                );
            }

            await queryClient.invalidateQueries({ queryKey: queryKeys.cart.details() });
        } finally {
            setIsMerging(false);
        }
    }, [guestItems, queryClient, removeMergedItems, guestClearCart, isMerging]);

    useEffect(() => {
        if (isAuthenticated && guestItems.length > 0 && !hasMergedRef.current) {
            merge();
        }
    }, [isAuthenticated, guestItems.length, merge]);

    // ── Derive unified state ──────────────────────────────────────────────
    const value: CartContextValue = isAuthenticated
        ? {
            source: "auth",
            items: serverCart?.items ?? [],
            totalItems: serverCart?.totalItems ?? 0,
            subtotal: serverCart?.subtotal ?? 0,
            discountAmount: serverCart?.discountAmount ?? 0,
            total: serverCart?.total ?? 0,
            isLoading: serverLoading || isMerging,
            isFetching: serverFetching || isMerging,
            isPending: addMutation.isPending || removeMutation.isPending || updateMutation.isPending || isMerging,
            isAdding: addMutation.isPending,
            isRemoving: removeMutation.isPending,
            isUpdating: updateMutation.isPending,
            isOpen,
            openCart,
            closeCart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isInCart,
        }
        : {
            source: "guest",
            items: guestItems.map(guestItemToCartItem),
            totalItems: guestTotalItems,
            subtotal: guestSubtotal,
            discountAmount: 0,
            total: guestTotal,
            isLoading: false,
            isFetching: false,
            isPending: addMutation.isPending || removeMutation.isPending || updateMutation.isPending,
            isAdding: addMutation.isPending,
            isRemoving: removeMutation.isPending,
            isUpdating: updateMutation.isPending,
            isOpen,
            openCart,
            closeCart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isInCart,
        };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useCartContext
 *
 * The ONLY cart hook your components need.
 * Must be used inside <CartProvider>.
 *
 * @example
 * const { items, totalItems, addItem, removeItem } = useCartContext();
 */
export function useCartContext(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCartContext must be used inside <CartProvider>");
    }
    return ctx;
}