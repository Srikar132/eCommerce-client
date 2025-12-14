"use client";

import { getQueryClient } from "@/lib/tanstack/query-client";
import {  QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const TanstackProvider = ({ children }: { children: ReactNode }) => {

    return (
        <QueryClientProvider client={getQueryClient()}>
            {children}
        </QueryClientProvider>
    );
};

export default TanstackProvider;