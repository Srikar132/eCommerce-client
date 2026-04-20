"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ShoppingCart,
    ExternalLink,
    CheckCircle2,
    Clock,
    Truck,
    AlertCircle,
    XCircle,
    RefreshCcw,
    PackageX,
} from "lucide-react";
import Link from "next/link";
import { useRecentOrders } from "@/lib/tanstack/queries/dashboard.queries";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: typeof CheckCircle2; label: string }> = {
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-600", icon: CheckCircle2, label: "Delivered" },
    PROCESSING: { bg: "bg-blue-500/10", text: "text-blue-600", icon: Clock, label: "Processing" },
    CONFIRMED: { bg: "bg-blue-500/10", text: "text-blue-600", icon: CheckCircle2, label: "Confirmed" },
    SHIPPED: { bg: "bg-violet-500/10", text: "text-violet-600", icon: Truck, label: "Shipped" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-600", icon: AlertCircle, label: "Pending" },
    CANCELLED: { bg: "bg-rose-500/10", text: "text-rose-600", icon: XCircle, label: "Cancelled" },
    RETURN_REQUESTED: { bg: "bg-orange-500/10", text: "text-orange-600", icon: RefreshCcw, label: "Return Requested" },
    RETURNED: { bg: "bg-gray-500/10", text: "text-gray-600", icon: PackageX, label: "Returned" },
    REFUNDED: { bg: "bg-violet-500/10", text: "text-violet-600", icon: RefreshCcw, label: "Refunded" },
};

interface OrderRowProps {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
}

function OrderRow({ id, orderNumber, customerName, totalAmount, status, createdAt }: OrderRowProps) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const StatusIcon = config.icon;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Link href={`/admin/orders/${id}`} className="block">
            <div className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg} shrink-0 transition-transform group-hover:scale-105`}>
                        <StatusIcon className={`h-5 w-5 ${config.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold truncate text-sm sm:text-base">{orderNumber}</p>
                            <Badge variant="outline" className={`text-[10px] sm:text-xs px-2 py-0.5 ${config.bg} ${config.text} border-0 font-medium shrink-0`}>
                                {config.label}
                            </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{customerName}</p>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                    <p className="font-bold text-sm sm:text-base">{formatCurrency(totalAmount)}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                        {formatRelativeTime(createdAt)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function OrderRowSkeleton() {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
            <div className="text-right space-y-1.5">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
            </div>
        </div>
    );
}

export function RecentOrders() {
    const { data: orders, isLoading, error } = useRecentOrders(6);

    return (
        <Card className="border border-border/40 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Recent Orders
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="text-sm h-8 gap-1 text-muted-foreground hover:text-primary">
                        <Link href="/admin/orders">
                            View All
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {isLoading ? (
                    <div className="space-y-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <OrderRowSkeleton key={i} />
                        ))}
                    </div>
                ) : error || !orders?.length ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-muted-foreground">No orders yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Orders will appear here when placed</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {orders.map((order) => (
                            <OrderRow key={order.id} {...order} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
