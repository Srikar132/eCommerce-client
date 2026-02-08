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
        <div className="flex justify-center mt-6">
            <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
            >
                <ChevronDown className="mr-2 h-4 w-4" />
                Load More Orders
            </Button>
        </div>
    );
}
