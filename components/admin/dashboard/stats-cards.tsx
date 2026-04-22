"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    TrendingUp,
    TrendingDown,
    Package,
    ShoppingCart,
    Users,
    IndianRupee,
} from "lucide-react";
import { useDashboardStats } from "@/lib/tanstack/queries/dashboard.queries";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease" | "neutral";
    icon: React.ReactNode;
    iconBg: string;
    subtitle: string;
}

function StatCard({ title, value, change, changeType, icon, iconBg, subtitle }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl transition-all duration-300 hover:shadow-xl hover:border-primary/20 group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase ml-0.5">{title}</p>
                        <h3 className="text-3xl font-black tracking-tight text-foreground/90">{value}</h3>
                        <div className="flex items-center gap-2">
                            {changeType === "increase" ? (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 gap-1 text-[10px] font-bold uppercase tracking-tight py-0.5">
                                    <TrendingUp className="h-3 w-3" />
                                    {change}
                                </Badge>
                            ) : changeType === "decrease" ? (
                                <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 gap-1 text-[10px] font-bold uppercase tracking-tight py-0.5">
                                    <TrendingDown className="h-3 w-3" />
                                    {change}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-tight py-0.5">
                                    {change}
                                </Badge>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{subtitle}</span>
                        </div>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatCardSkeleton() {
    return (
        <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
            </CardContent>
        </Card>
    );
}

export function StatsCards() {
    const { data: stats, isLoading, error } = useDashboardStats();

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border border-border/50 bg-card/50">
                        <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground">Unable to load data</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Revenue"
                value={formatCurrency(stats.totalRevenue)}
                change={`${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%`}
                changeType={stats.revenueChange > 0 ? "increase" : stats.revenueChange < 0 ? "decrease" : "neutral"}
                icon={<IndianRupee className="h-6 w-6 text-emerald-600" />}
                iconBg="bg-emerald-500/15"
                subtitle="this week"
            />
            <StatCard
                title="Orders"
                value={formatNumber(stats.totalOrders)}
                change={`${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%`}
                changeType={stats.ordersChange > 0 ? "increase" : stats.ordersChange < 0 ? "decrease" : "neutral"}
                icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
                iconBg="bg-blue-500/15"
                subtitle="this week"
            />
            <StatCard
                title="Products"
                value={stats.totalProducts.toString()}
                change={`+${stats.productsChange} new`}
                changeType={stats.productsChange > 0 ? "increase" : "neutral"}
                icon={<Package className="h-6 w-6 text-violet-600" />}
                iconBg="bg-violet-500/15"
                subtitle="this week"
            />
            <StatCard
                title="Customers"
                value={formatNumber(stats.totalCustomers)}
                change={`+${stats.customersChange} new`}
                changeType={stats.customersChange > 0 ? "increase" : "neutral"}
                icon={<Users className="h-6 w-6 text-amber-600" />}
                iconBg="bg-amber-500/15"
                subtitle="this week"
            />
        </div>
    );
}
