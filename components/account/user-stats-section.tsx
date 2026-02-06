'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Heart, ShoppingCart, MapPin } from 'lucide-react';
import { useUserStats } from '@/lib/tanstack/queries/account.queries';
import { Skeleton } from '@/components/ui/skeleton';

export function UserStatsSection() {
    const { data: stats, isLoading } = useUserStats();

    const statItems = [
        {
            label: 'Total Orders',
            value: stats?.totalOrders ?? 0,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Wishlist Items',
            value: stats?.wishlistItems ?? 0,
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            label: 'Saved Addresses',
            value: stats?.savedAddresses ?? 0,
            icon: MapPin,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Cart Items',
            value: stats?.cartItems ?? 0,
            icon: ShoppingCart,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statItems.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center justify-center p-3 rounded-md border bg-card hover:bg-accent/50 transition-all duration-200"
                            >
                                <div className={`p-2 rounded-full ${stat.bgColor} mb-2`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-7 w-10 mb-1" />
                                ) : (
                                    <p className="text-xl font-bold mb-0.5">{stat.value}</p>
                                )}
                                <p className="text-[10px] text-muted-foreground text-center leading-tight">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
