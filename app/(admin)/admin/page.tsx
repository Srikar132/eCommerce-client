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
        <div className="space-y-10 py-2 md:py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/60">
                <div className="space-y-1.5">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground/90 uppercase">
                        {greeting}, {userName}
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Welcome back to your command center. Here is a high-level overview of your store&apos;s performance and critical tasks for today.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Dashboard</span>
                </div>
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
