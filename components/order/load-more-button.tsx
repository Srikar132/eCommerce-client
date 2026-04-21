"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface LoadMoreButtonProps {
    currentPage: number;
}


export default function LoadMoreButton({ currentPage }: LoadMoreButtonProps) {
    const router = useRouter();

    const handleLoadMore = () => {
        router.push(`/orders?page=${currentPage + 1}`);
    };

    return (
        <Button
            onClick={handleLoadMore}
            variant="outline"
            className="rounded-full px-12 py-6 h-auto font-bold border-muted-foreground/20 hover:bg-muted group transition-all"
        >
            <ChevronDown className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            Load More Orders
        </Button>
    );
}

