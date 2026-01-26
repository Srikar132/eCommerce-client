import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes - Increased to reduce memory churn
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,
      },
      dehydrate: {
        // Only dehydrate successful queries to reduce server memory
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) &&
          query.state.status === 'success',
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