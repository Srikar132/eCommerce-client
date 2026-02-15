"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { useOrderStatusCounts } from "@/lib/tanstack/queries/dashboard.queries";

interface PipelineStageProps {
    label: string;
    count: number;
    total: number;
    color: string;
    href: string;
}

function PipelineStage({ label, count, total, color, href }: PipelineStageProps) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <Link href={href}>
            <div className="flex-1 min-w-0 group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        {label}
                    </span>
                    <span className="text-sm font-semibold">{count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                        className={`h-full ${color} transition-all duration-500 ease-out group-hover:opacity-80`}
                        style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                    />
                </div>
            </div>
        </Link>
    );
}

function PipelineSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            ))}
        </div>
    );
}

export function OrderPipeline() {
    const { data: statusCounts, isLoading } = useOrderStatusCounts();

    if (isLoading) {
        return (
            <Card className="border border-border/40 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Order Pipeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PipelineSkeleton />
                </CardContent>
            </Card>
        );
    }

    const counts = statusCounts || {};
    const pending = counts.PENDING || 0;
    const confirmed = counts.CONFIRMED || 0;
    const processing = counts.PROCESSING || 0;
    const shipped = counts.SHIPPED || 0;
    const delivered = counts.DELIVERED || 0;
    const cancelled = counts.CANCELLED || 0;
    const returnRequested = counts.RETURN_REQUESTED || 0;
    const returned = counts.RETURNED || 0;

    const activeOrders = pending + confirmed + processing + shipped;
    const completedOrders = delivered;
    const problemOrders = cancelled + returnRequested + returned;
    const totalOrders = activeOrders + completedOrders + problemOrders;

    return (
        <Card className="border border-border/40 bg-card shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Order Pipeline
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">{totalOrders} total</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main Pipeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <PipelineStage
                        label="Pending"
                        count={pending + confirmed}
                        total={totalOrders}
                        color="bg-amber-500"
                        href="/admin/orders?status=pending"
                    />
                    <PipelineStage
                        label="Processing"
                        count={processing}
                        total={totalOrders}
                        color="bg-blue-500"
                        href="/admin/orders?status=processing"
                    />
                    <PipelineStage
                        label="Shipped"
                        count={shipped}
                        total={totalOrders}
                        color="bg-violet-500"
                        href="/admin/orders?status=shipped"
                    />
                    <PipelineStage
                        label="Delivered"
                        count={delivered}
                        total={totalOrders}
                        color="bg-emerald-500"
                        href="/admin/orders?status=delivered"
                    />
                </div>

                {/* Problems Section - Only show if there are issues */}
                {problemOrders > 0 && (
                    <div className="pt-4 border-t border-border/40">
                        <p className="text-sm text-muted-foreground mb-4">Requires Attention</p>
                        <div className="grid grid-cols-3 gap-4">
                            {returnRequested > 0 && (
                                <PipelineStage
                                    label="Return Requested"
                                    count={returnRequested}
                                    total={problemOrders}
                                    color="bg-orange-500"
                                    href="/admin/orders?status=return_requested"
                                />
                            )}
                            {cancelled > 0 && (
                                <PipelineStage
                                    label="Cancelled"
                                    count={cancelled}
                                    total={problemOrders}
                                    color="bg-rose-500"
                                    href="/admin/orders?status=cancelled"
                                />
                            )}
                            {returned > 0 && (
                                <PipelineStage
                                    label="Returned"
                                    count={returned}
                                    total={problemOrders}
                                    color="bg-gray-500"
                                    href="/admin/orders?status=returned"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40 text-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <span className="text-muted-foreground">Active: <span className="font-medium text-foreground">{activeOrders}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">Completed: <span className="font-medium text-foreground">{completedOrders}</span></span>
                        </div>
                    </div>
                    {problemOrders > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                            <span className="text-muted-foreground">Issues: <span className="font-medium text-foreground">{problemOrders}</span></span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
