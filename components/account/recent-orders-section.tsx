"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";
import { useMyRecentOrders } from "@/lib/tanstack/queries/orders.queries";
import { Card, CardContent } from "@/components/ui/card";
import RecentOrderCard from "@/components/cards/recent-order-card";

/**
 * Recent Orders Section Component
 * Displays the 3 most recent orders for the authenticated user
 * Handles loading and empty states
 */
export default function RecentOrdersSection() {
    const { data, isLoading, isError } = useMyRecentOrders({
        page: 0,
        size: 3
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-accent/30">
                    <div>
                        <h2 className="text-3xl font-serif font-light text-foreground mb-1">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground">Track your latest purchases</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-32 bg-muted rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-accent/30">
                    <div>
                        <h2 className="text-3xl font-serif font-light text-foreground mb-1">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground">Track your latest purchases</p>
                    </div>
                </div>
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 text-destructive/70" />
                        <p className="text-destructive font-medium">Failed to load orders</p>
                        <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const orders = data?.content || [];
    const isEmpty = orders.length === 0;

    // Empty state
    if (isEmpty) {
        return (
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-accent/30">
                    <div>
                        <h2 className="text-3xl font-serif font-light text-foreground mb-1">Recent Orders</h2>
                        <p className="text-sm text-muted-foreground">Track your latest purchases</p>
                    </div>
                </div>
                <Card className="border-dashed border-2 bg-muted/30">
                    <CardContent className="p-12 text-center">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Start exploring our collection and place your first order to see it here.
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="rounded-full">
                                Browse Products
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Orders exist - display them
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-accent/30">
                <div>
                    <h2 className="text-3xl font-serif font-light text-foreground mb-1">Recent Orders</h2>
                    <p className="text-sm text-muted-foreground">Track your latest purchases</p>
                </div>
                <Link href="/account/orders">
                    <Button
                        variant="ghost"
                        className="text-primary hover:text-primary/80 hover:bg-accent/50 font-medium rounded-full px-6 transition-all duration-300 hover:shadow-md"
                    >
                        View All
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <RecentOrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
