/**
 * ADMIN DASHBOARD QUERY HOOKS
 *
 * TanStack Query hooks for admin dashboard data fetching.
 * Provides caching, background refetching, and optimistic updates.
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
    getAdminDashboardStats,
    getRecentOrders,
    getLowStockProducts,
    getOrderStatusCounts,
    getPaymentStatusCounts,
    getCategoryStats,
    type DashboardStats,
    type RecentOrder,
    type LowStockProduct,
} from "@/lib/actions/admin-actions";

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

/**
 * Hook to fetch dashboard statistics
 * Includes revenue, orders, products, and customers with weekly changes
 */
export function useDashboardStats() {
    return useQuery<DashboardStats | undefined, Error>({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: async () => {
            const result = await getAdminDashboardStats();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch dashboard stats");
            }
            return result.data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes - stats don't need to be super fresh
        refetchInterval: 5 * 60 * 1000, // Auto refetch every 5 minutes
    });
}

// ============================================================================
// RECENT ORDERS
// ============================================================================

/**
 * Hook to fetch recent orders
 * @param limit - Number of orders to fetch (default: 5)
 */
export function useRecentOrders(limit: number = 5) {
    return useQuery<RecentOrder[] | undefined, Error>({
        queryKey: queryKeys.dashboard.recentOrders(limit),
        queryFn: async () => {
            const result = await getRecentOrders(limit);
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch recent orders");
            }
            return result.data;
        },
        staleTime: 1 * 60 * 1000, // 1 minute - orders need to be more fresh
        refetchInterval: 2 * 60 * 1000, // Auto refetch every 2 minutes
    });
}

// ============================================================================
// LOW STOCK PRODUCTS
// ============================================================================

/**
 * Hook to fetch low stock products
 * @param threshold - Stock threshold to consider as "low" (default: 10)
 */
export function useLowStockProducts(threshold: number = 10) {
    return useQuery<LowStockProduct[] | undefined, Error>({
        queryKey: queryKeys.dashboard.lowStock(threshold),
        queryFn: async () => {
            const result = await getLowStockProducts(threshold);
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch low stock products");
            }
            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - stock levels don't change rapidly
    });
}

// ============================================================================
// ORDER STATUS COUNTS
// ============================================================================

/**
 * Hook to fetch order status counts
 * Returns counts for each order status (PENDING, PROCESSING, SHIPPED, etc.)
 */
export function useOrderStatusCounts() {
    return useQuery<Record<string, number> | undefined, Error>({
        queryKey: queryKeys.dashboard.orderStatusCounts(),
        queryFn: async () => {
            const result = await getOrderStatusCounts();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch order status counts");
            }
            return result.data;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 2 * 60 * 1000, // Auto refetch every 2 minutes
    });
}

// ============================================================================
// PAYMENT STATUS COUNTS
// ============================================================================

/**
 * Hook to fetch payment status counts
 * Returns counts for each payment status
 */
export function usePaymentStatusCounts() {
    return useQuery<Record<string, number> | undefined, Error>({
        queryKey: queryKeys.dashboard.paymentStatusCounts(),
        queryFn: async () => {
            const result = await getPaymentStatusCounts();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch payment status counts");
            }
            return result.data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

// ============================================================================
// CATEGORY STATISTICS
// ============================================================================

/**
 * Hook to fetch category statistics
 * Returns product counts per category
 */
export function useCategoryStats() {
    return useQuery<{ id: string; name: string; productCount: number }[] | undefined, Error>({
        queryKey: queryKeys.dashboard.categoryStats(),
        queryFn: async () => {
            const result = await getCategoryStats();
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch category stats");
            }
            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    });
}

// ============================================================================
// COMPOSITE HOOKS
// ============================================================================

/**
 * Hook to fetch all dashboard data at once
 * Useful for initial page load
 */
export function useDashboardData() {
    const stats = useDashboardStats();
    const recentOrders = useRecentOrders(5);
    const lowStock = useLowStockProducts(10);
    const orderStatusCounts = useOrderStatusCounts();
    const categoryStats = useCategoryStats();

    return {
        stats,
        recentOrders,
        lowStock,
        orderStatusCounts,
        categoryStats,
        isLoading:
            stats.isLoading ||
            recentOrders.isLoading ||
            lowStock.isLoading ||
            orderStatusCounts.isLoading ||
            categoryStats.isLoading,
        isError:
            stats.isError ||
            recentOrders.isError ||
            lowStock.isError ||
            orderStatusCounts.isError ||
            categoryStats.isError,
    };
}
