"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Clock,
    AlertTriangle,
    RefreshCcw,
    ArrowRight,
    CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useOrderStatusCounts, useLowStockProducts, usePaymentStatusCounts } from "@/lib/tanstack/queries/dashboard.queries";

interface ActionItemProps {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    count: number;
    href: string;
    priority: "high" | "medium" | "low";
}

function ActionItem({ icon, iconBg, title, description, count, href, priority }: ActionItemProps) {
    const priorityColors = {
        high: "border-l-rose-500",
        medium: "border-l-amber-500",
        low: "border-l-blue-500",
    };

    return (
        <Link href={href}>
            <div className={`flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-card hover:bg-accent/50 transition-colors cursor-pointer border-l-4 ${priorityColors[priority]}`}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-medium">{title}</p>
                        <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 text-sm font-semibold bg-primary/10 text-primary rounded-full">
                            {count}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
        </Link>
    );
}

function ActionItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/50">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
        </div>
    );
}

export function ActionItems() {
    const { data: orderStatus, isLoading: orderLoading } = useOrderStatusCounts();
    const { data: lowStock, isLoading: stockLoading } = useLowStockProducts(10);
    const { data: paymentStatus, isLoading: paymentLoading } = usePaymentStatusCounts();

    const isLoading = orderLoading || stockLoading || paymentLoading;

    // Calculate action items
    const pendingOrders = (orderStatus?.PENDING || 0) + (orderStatus?.CONFIRMED || 0);
    const returnRequests = orderStatus?.RETURN_REQUESTED || 0;
    const lowStockCount = lowStock?.length || 0;
    const pendingPayments = paymentStatus?.PENDING || 0;

    // Only show items that need attention
    const hasActionItems = pendingOrders > 0 || returnRequests > 0 || lowStockCount > 0 || pendingPayments > 0;

    if (isLoading) {
        return (
            <Card className="border border-border/40 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Needs Attention
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ActionItemSkeleton />
                    <ActionItemSkeleton />
                    <ActionItemSkeleton />
                </CardContent>
            </Card>
        );
    }

    if (!hasActionItems) {
        return (
            <Card className="border border-border/40 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Needs Attention
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-medium">All caught up!</p>
                        <p className="text-sm text-muted-foreground mt-1">No pending tasks at the moment</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border/40 bg-card shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Needs Attention
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                        {pendingOrders + returnRequests + (lowStockCount > 0 ? 1 : 0) + (pendingPayments > 0 ? 1 : 0)} items
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {pendingOrders > 0 && (
                    <ActionItem
                        icon={<Clock className="h-5 w-5 text-amber-600" />}
                        iconBg="bg-amber-500/10"
                        title="Orders to Process"
                        description="Pending and confirmed orders waiting for action"
                        count={pendingOrders}
                        href="/admin/orders?status=pending"
                        priority="high"
                    />
                )}

                {returnRequests > 0 && (
                    <ActionItem
                        icon={<RefreshCcw className="h-5 w-5 text-orange-600" />}
                        iconBg="bg-orange-500/10"
                        title="Return Requests"
                        description="Customer return requests require approval"
                        count={returnRequests}
                        href="/admin/orders?status=return_requested"
                        priority="high"
                    />
                )}

                {pendingPayments > 0 && (
                    <ActionItem
                        icon={<CreditCard className="h-5 w-5 text-blue-600" />}
                        iconBg="bg-blue-500/10"
                        title="Pending Payments"
                        description="Orders with pending payment confirmation"
                        count={pendingPayments}
                        href="/admin/orders?payment=pending"
                        priority="medium"
                    />
                )}

                {lowStockCount > 0 && (
                    <ActionItem
                        icon={<AlertTriangle className="h-5 w-5 text-rose-600" />}
                        iconBg="bg-rose-500/10"
                        title="Low Stock Alert"
                        description="Products running low on inventory"
                        count={lowStockCount}
                        href="/admin/products?stock=low"
                        priority="medium"
                    />
                )}
            </CardContent>
        </Card>
    );
}
