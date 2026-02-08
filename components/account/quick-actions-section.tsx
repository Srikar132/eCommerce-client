'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Heart, MapPin, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '../auth/logout-button';

export function QuickActionsSection() {
    const actions = [
        {
            label: 'My Orders',
            href: '/orders',
            icon: Package,
            description: 'View your order history',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Wishlist',
            href: '/wishlist',
            icon: Heart,
            description: 'Your saved items',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    return (
        <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.href} href={action.href}>
                            <Button
                                variant="outline"
                                className="w-full justify-start h-auto py-2.5 px-3 hover:bg-accent/50 transition-all duration-200 group"
                            >
                                <div className={`p-1.5 rounded-full ${action.bgColor} mr-2.5 shrink-0`}>
                                    <Icon className={`w-3.5 h-3.5 ${action.color}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </Button>
                        </Link>
                    );
                })}

                <div className="pt-2 border-t">
                    <LogoutButton />
                </div>
            </CardContent>
        </Card>
    );
}
