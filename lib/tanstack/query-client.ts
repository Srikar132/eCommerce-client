import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';


function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Server-side: Don't refetch on mount since data is fresh from prefetch
        // Client-side: Refetch stale data
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
      },
      dehydrate: {
        // Include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get or create QueryClient
 * - Server: Creates new instance per request
 * - Client: Reuses single instance (singleton)
 */
export function getQueryClient() {
  if (isServer) {
    // Server: Always create new client
    console.log('[QueryClient] Creating new server-side client');
    return makeQueryClient();
  } else {
    // Client: Reuse singleton
    if (!browserQueryClient) {
      console.log('[QueryClient] Creating browser client singleton');
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}