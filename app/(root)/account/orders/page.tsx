"use client";

import { useInfiniteOrders } from "@/lib/tanstack/queries/orders.queries";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import RecentOrderCard from "@/components/cards/recent-order-card";
import { Card } from "@/components/ui/card";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersPage() {
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteOrders({ page: 0, size: 10 });

    console.log(data);

    const sentinelRef = useInfiniteScroll({
        hasNextPage: hasNextPage ?? false,
        isFetchingNextPage,
        fetchNextPage,
        rootMargin: "400px",
    });

    // Loading state - Initial load
    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                    <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="h-6 bg-muted rounded w-32"></div>
                                        <div className="h-6 bg-muted rounded w-24"></div>
                                    </div>
                                    <div className="h-4 bg-muted rounded w-48"></div>
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 bg-muted rounded w-20"></div>
                                        <div className="h-8 bg-muted rounded w-24"></div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    // Error state
    if (isError) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                    <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
                    <Card className="p-12">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <AlertCircle className="h-16 w-16 text-destructive" />
                            <h3 className="text-xl font-semibold">Failed to Load Orders</h3>
                            <p className="text-muted-foreground max-w-md">
                                {error instanceof Error
                                    ? error.message
                                    : "We couldn't load your orders. Please try again later."}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                            >
                                Retry
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        );
    }

    // Get all orders from all pages
    const allOrders = data?.pages.flatMap((page) => page.content) ?? [];

    // Empty state
    if (allOrders.length === 0) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                    <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
                    <Card className="p-12">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <Package className="h-16 w-16 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">No Orders Yet</h3>
                            <p className="text-muted-foreground max-w-md">
                                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                            </p>
                            <Button asChild>
                                <Link href="/products">Browse Products</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        );
    }

    // Success state with orders
    return (
        <main className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Your Orders</h1>
                    <p className="text-muted-foreground">
                        {data?.pages[0]?.totalElements ?? 0} total order
                        {(data?.pages[0]?.totalElements ?? 0) !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="space-y-4">
                    {allOrders.map((order) => (
                        <RecentOrderCard key={order.id} order={order} />
                    ))}
                </div>

                {/* Sentinel element for infinite scroll */}
                <div ref={sentinelRef} className="py-8">
                    {isFetchingNextPage && (
                        <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">
                                Loading more orders...
                            </span>
                        </div>
                    )}
                    {!hasNextPage && allOrders.length > 0 && (
                        <p className="text-center text-muted-foreground">
                            You&apos;ve reached the end of your orders
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}