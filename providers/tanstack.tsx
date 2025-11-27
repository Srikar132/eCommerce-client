"use client";

import { QueryClient, QueryClientProvider, QueryClientProviderProps } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const TanstackProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 1,
                    refetchOnWindowFocus: true,
                    staleTime: 1000 * 60, // 1 min
                },
            },
        })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanstackProvider;