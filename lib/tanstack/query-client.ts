// lib/tanstack/query-client.ts
import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data from SSR is considered fresh for 60s — no immediate client refetch
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // Also dehydrate pending queries (for streaming/Suspense)
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always new instance (no shared state between requests)
    return makeQueryClient();
  }
  // Browser: reuse the same instance so the cache persists across navigations
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}