// app/utils/query-client.ts
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache() ensures this is unique per request in Next.js
export const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
}));