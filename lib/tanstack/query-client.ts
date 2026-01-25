import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - Reduced from 5 minutes for fresher data
        gcTime: 5 * 60 * 1000, // 5 minutes - Reduced from 10 minutes to prevent memory buildup
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,
      },
      dehydrate: {
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
 * - Server: Creates new instance per request (required by Next.js)
 * - Client: Reuses single instance (singleton)
 */
export function getQueryClient() {
  if (isServer) {
    // Server: Always create new client per request
    return makeQueryClient();
  } else {
    // Client: Reuse singleton for better caching
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}