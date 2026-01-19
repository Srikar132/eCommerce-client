import { Order, PagedResponse } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { ordersApi } from "@/lib/api/orders";



/**
 * Custom hook to fetch user's orders
 * @returns Query result for user's orders
 */
export const useMyRecentOrders = ({
    page = 0,
    size = 3
}) => {
  return useQuery<PagedResponse<Order>>({
    queryKey: queryKeys.orders.my(page, size),
    queryFn: () => ordersApi.getMyOrders(page, size),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5,
  });
};

/**
 * useInfiniteQuery hook for pagination
 */
export const useInfiniteOrders = (params: {
  page?: number;
  size?: number;
}) => {
  const { page = 0, size = 24 } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.orders.my(page, size),
    queryFn: ({ pageParam = page }) =>
      ordersApi.getMyOrders(
        pageParam,
        size
      ),
    initialPageParam: page,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

