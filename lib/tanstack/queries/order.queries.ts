// ============================================================================
// ORDER QUERY HOOKS
// ============================================================================

import { getAllOrders, updateOrderStatus } from "@/lib/actions/order-actions";
import { PagedResponse } from "@/types";
import { OrderParams, OrderWithUser, OrderStatus } from "@/types/orders";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

/**
 * Infinite scroll order list with filters, pagination, and sorting
 */
export const useInfiniteOrders = (params: OrderParams, initialData?: PagedResponse<OrderWithUser>) => {
    const { status, paymentStatus, searchQuery, page = 0, limit = 20, sortBy = 'CREATED_AT_DESC' } = params;

    return useInfiniteQuery({
        queryKey: queryKeys.orders.list({ status, paymentStatus, searchQuery, page, limit, sortBy }),
        queryFn: ({ pageParam = page }) =>
            getAllOrders({ status, paymentStatus, searchQuery, page: pageParam, limit, sortBy }),
        initialPageParam: page,
        getNextPageParam: (lastPage: PagedResponse<OrderWithUser>) =>
            lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...(initialData && {
            initialData: {
                pages: [initialData],
                pageParams: [page],
            },
        }),
    });
};

/**
 * Update order status mutation
 */
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: OrderStatus }) =>
            updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
            // Invalidate orders queries to refetch
            queryClient.invalidateQueries({
                queryKey: ['orders'],
            });
        },
    });
};

//============================================================================
// // HELPER HOOKS
//============================================================================

/**
 * Get flat array of orders from infinite query result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteOrders({ page: 0, size: 24 });
 * const orders = useFlatOrders(query.data);
 * ```
 */
export const useFlatOrders = (data: ReturnType<typeof useInfiniteOrders>['data']) => {
    return data?.pages.flatMap((page) => page.data) ?? [];
};

/**
 * Get total order count from infinite query result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteOrders({ page: 0, size: 24 });
 * const total = useOrderCount(query.data);
 * ```
 */
export const useOrderCount = (data: ReturnType<typeof useInfiniteOrders>['data']) => {
    return data?.pages[0]?.totalElements ?? 0;
};