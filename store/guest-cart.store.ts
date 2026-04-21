import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GuestCartItem } from "@/types/cart";
import { ProductSummary, VariantSummary } from "@/types/cart";

// ============================================================================
// HELPERS
// ============================================================================

function makeLocalId(): string {
    // crypto.randomUUID works in modern browsers & Node 19+
    // Fallback for older runtimes
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function calcTotals(items: GuestCartItem[]) {
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.itemTotal, 0);
    return { totalItems, subtotal, total: subtotal };
}

// ============================================================================
// STATE & ACTIONS
// ============================================================================

interface GuestCartState {
    items: GuestCartItem[];
    totalItems: number;
    subtotal: number;
    total: number;

    addItem: (
        productId: string,
        productVariantId: string,
        quantity: number,
        unitPrice: number,
        product: ProductSummary,
        variant: VariantSummary
    ) => void;

    removeItem: (localId: string) => void;

    updateQuantity: (localId: string, quantity: number) => void;

    clearCart: () => void;

    /** Used by the merge hook — remove items that were successfully merged */
    removeMergedItems: (localIds: string[]) => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useGuestCartStore = create<GuestCartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            subtotal: 0,
            total: 0,

            addItem(productId, productVariantId, quantity, unitPrice, product, variant) {
                const items = [...get().items];
                const idx = items.findIndex(
                    (i) =>
                        i.productId === productId &&
                        i.productVariantId === productVariantId
                );

                if (idx !== -1) {
                    // Item already in guest cart — increment quantity
                    const existing = items[idx];
                    const newQty = existing.quantity + quantity;
                    items[idx] = {
                        ...existing,
                        quantity: newQty,
                        itemTotal: parseFloat((unitPrice * newQty).toFixed(2)),
                    };
                } else {
                    items.push({
                        localId: makeLocalId(),
                        productId,
                        productVariantId,
                        quantity,
                        unitPrice,
                        itemTotal: parseFloat((unitPrice * quantity).toFixed(2)),
                        addedAt: new Date().toISOString(),
                        product,
                        variant,
                    });
                }

                set({ items, ...calcTotals(items) });
            },

            removeItem(localId) {
                const items = get().items.filter((i) => i.localId !== localId);
                set({ items, ...calcTotals(items) });
            },

            updateQuantity(localId, quantity) {
                if (quantity < 1) return;
                const items = get().items.map((i) =>
                    i.localId === localId
                        ? {
                            ...i,
                            quantity,
                            itemTotal: parseFloat((i.unitPrice * quantity).toFixed(2)),
                        }
                        : i
                );
                set({ items, ...calcTotals(items) });
            },

            clearCart() {
                set({ items: [], totalItems: 0, subtotal: 0, total: 0 });
            },

            removeMergedItems(localIds) {
                const items = get().items.filter(
                    (i) => !localIds.includes(i.localId)
                );
                set({ items, ...calcTotals(items) });
            },
        }),
        {
            name: "guest-cart",
            storage: createJSONStorage(() => localStorage),
            // Only persist the items array — totals are derived
            partialize: (state) => ({ items: state.items }),
            // Rehydrate derived fields after rehydration
            onRehydrateStorage: () => (state) => {
                if (state) {
                    const { totalItems, subtotal, total } = calcTotals(state.items);
                    state.totalItems = totalItems;
                    state.subtotal = subtotal;
                    state.total = total;
                }
            },
        }
    )
);