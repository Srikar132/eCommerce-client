// ============================================================================
// USER QUERY HOOKS
// ============================================================================

import { getAllUsers, deleteUser, updateUserRole } from "@/lib/actions/user-actions";
import { PagedResponse } from "@/types";
import { UserParams, UserWithStats, UserRole } from "@/types/auth";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

/**
 * Infinite scroll user list with filters, pagination, and sorting
 */
export const useInfiniteUsers = (params: UserParams, initialData?: PagedResponse<UserWithStats>) => {
    const { role, searchQuery, page = 0, limit = 20, sortBy = 'CREATED_AT_DESC' } = params;

    return useInfiniteQuery({
        queryKey: queryKeys.users.list({ role, searchQuery, page, limit, sortBy }),
        queryFn: ({ pageParam = page }) =>
            getAllUsers({ role, searchQuery, page: pageParam, limit, sortBy }),
        initialPageParam: page,
        getNextPageParam: (lastPage: PagedResponse<UserWithStats>) =>
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
 * Delete user mutation
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            // Invalidate users queries to refetch
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });
};

/**
 * Update user role mutation
 */
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) =>
            updateUserRole(userId, newRole),
        onSuccess: () => {
            // Invalidate users queries to refetch
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });
};

//============================================================================
// // HELPER HOOKS
//============================================================================

/**
 * Get flat array of users from infinite query result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteUsers({ page: 0, size: 24 });
 * const users = useFlatUsers(query.data);
 * ```
 */
export const useFlatUsers = (data: ReturnType<typeof useInfiniteUsers>['data']) => {
    return data?.pages.flatMap((page) => page.data) ?? [];
};

/**
 * Get total user count from infinite query result
 * 
 * @example
 * ```tsx
 * const query = useInfiniteUsers({ page: 0, size: 24 });
 * const total = useUserCount(query.data);
 * ```
 */
export const useUserCount = (data: ReturnType<typeof useInfiniteUsers>['data']) => {
    return data?.pages[0]?.totalElements ?? 0;
};