import { Order, PagedResponse } from "@/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { ordersApi, CheckoutRequest, PaymentVerificationRequest, CheckoutResponse, OrderResponse } from "@/lib/api/orders";



// ================================================
// QUERIES
// ================================================

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

/**
 * Custom hook to fetch order details by order number
 * @param orderNumber - The unique order number
 * @returns Query result for order details
 */
export const useOrderDetails = (orderNumber: string) => {
  return useQuery<OrderResponse>({
    queryKey: ['orders', 'detail', orderNumber],
    queryFn: () => ordersApi.getOrderDetails(orderNumber),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!orderNumber, // Only fetch if orderNumber is provided
  });
};



// ================================================
// MUTATIONS
// ================================================

/**
 * Custom hook to initiate checkout and create order
 * @returns Mutation for checkout
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationFn: (checkoutData: CheckoutRequest) => ordersApi.checkout(checkoutData),
    onSuccess: () => {
      // Invalidate cart queries as cart will be cleared after checkout
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.summary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.count() });
    },
  });
};

/**
 * Custom hook to verify payment and confirm order
 * @returns Mutation for payment verification
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, PaymentVerificationRequest>({
    mutationFn: (verificationData: PaymentVerificationRequest) => 
      ordersApi.verifyPayment(verificationData),
    onSuccess: (data) => {
      // Invalidate orders queries to refetch updated order list
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      
      // Set the new order details in cache
      queryClient.setQueryData(['orders', 'detail', data.orderNumber], data);
    },
  });
};

/**
 * Custom hook to cancel an order
 * @returns Mutation for order cancellation
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, { orderNumber: string; reason: string }>({
    mutationFn: ({ orderNumber, reason }) => ordersApi.cancelOrder(orderNumber, reason),
    onSuccess: (data) => {
      // Invalidate orders queries to refetch updated order list
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      
      // Update the specific order in cache
      queryClient.setQueryData(['orders', 'detail', data.orderNumber], data);
    },
  });
};

/**
 * Custom hook to request order return
 * @returns Mutation for order return request
 */
export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, { orderNumber: string; reason: string }>({
    mutationFn: ({ orderNumber, reason }) => ordersApi.requestReturn(orderNumber, reason),
    onSuccess: (data) => {
      // Invalidate orders queries to refetch updated order list
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      
      // Update the specific order in cache
      queryClient.setQueryData(['orders', 'detail', data.orderNumber], data);
    },
  });
};

