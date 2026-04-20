import { auth } from "@/auth";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardClient } from "../../../components/admin/dashboard/dashboard-client";

// Skeleton components for loading states
function StatsCardsSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border border-border/50 bg-card/50">
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
            ))}
        </div>
    );
}

function ContentSkeleton() {
    return (
        <div className="space-y-6">
            {/* Pipeline Skeleton */}
            <Card className="border border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>

            {/* Main Grid Skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border border-border/50 bg-card/50">
                    <CardHeader className="pb-3 border-b border-border/50">
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between py-2">
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
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <Card key={i} className="border border-border/50 bg-card/50">
                            <CardHeader className="pb-3">
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton key={j} className="h-12 w-full rounded-lg" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default async function AdminDashboard() {
    const session = await auth();
    const userName = session?.user?.name?.split(' ')[0] || 'Admin';

    // Get current time for greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="admin-page-title">
                    {greeting}, {userName}
                </h1>
                <p className="text-base text-muted-foreground">
                    Here&apos;s an overview of your store today
                </p>
            </div>

            {/* Dashboard Content */}
            <Suspense fallback={<StatsCardsSkeleton />}>
                <Suspense fallback={<ContentSkeleton />}>
                    <DashboardClient />
                </Suspense>
            </Suspense>
        </div>
    );
}
