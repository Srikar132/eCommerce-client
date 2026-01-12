

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Heart, MapPin, ShoppingBag, Edit2, ChevronRight } from 'lucide-react';
import RecentOrderCard from '@/components/cards/recent-order-card';

// Static data for demonstration
const userData = {
    name: 'Srikar Reddy',
    email: 'srikar@email.com',
    phone: '+91 9876543210',
    avatar: '/images/avatar-placeholder.jpg',
};

const dashboardStats = [
    {
        icon: Package,
        label: 'Orders',
        value: '12',
        color: 'text-[oklch(0.72_0.12_15)]',
        bgColor: 'bg-[oklch(0.92_0.04_10)]',
    },
    {
        icon: Heart,
        label: 'Wishlist',
        value: '8',
        color: 'text-[oklch(0.72_0.12_15)]',
        bgColor: 'bg-[oklch(0.92_0.04_10)]',
    },
    {
        icon: MapPin,
        label: 'Saved\nAddresses',
        value: '3',
        color: 'text-[oklch(0.72_0.12_15)]',
        bgColor: 'bg-[oklch(0.92_0.04_10)]',
    },
    {
        icon: ShoppingBag,
        label: 'Pending\nOrders',
        value: '1',
        color: 'text-[oklch(0.72_0.12_15)]',
        bgColor: 'bg-[oklch(0.92_0.04_10)]',
    },
];

const recentOrders = [
    {
        id: '1',
        orderNumber: '7234',
        date: 'April 20, 2024',
        items: [
            { id: '1', name: 'Product 1', quantity: 1, price: 45.50 },
            { id: '2', name: 'Product 2', quantity: 2, price: 41.50 },
        ],
        totalAmount: 128.50,
        status: 'Processing' as const,
    },
    {
        id: '2',
        orderNumber: '7189',
        date: 'April 15, 2024',
        items: [
            { id: '1', name: 'Product 1', quantity: 1, price: 89.99 },
        ],
        totalAmount: 89.99,
        status: 'Delivered' as const,
    },
    {
        id: '3',
        orderNumber: '7102',
        date: 'April 10, 2024',
        items: [
            { id: '1', name: 'Product 1', quantity: 3, price: 150.00 },
        ],
        totalAmount: 150.00,
        status: 'Shipped' as const,
    },
];

export default function AccountPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 ">
                {/* Header Section */}
                <Card className="mb-8 overflow-hidden border-border bg-card shadow-sm">
                    <CardContent className="p-6 lg:p-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4 lg:gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-md">
                                        <span className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                                            {userData.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                                        {userData.name}
                                    </h1>
                                    <p className="text-sm lg:text-base text-muted-foreground">{userData.email}</p>
                                    <p className="text-sm lg:text-base text-muted-foreground">{userData.phone}</p>
                                </div>
                            </div>
                            <Link href="/account/account-details">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-accent hover:bg-accent/80 text-accent-foreground rounded-full h-10 w-10 shadow-sm"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {dashboardStats.map((stat, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden hover:shadow-md transition-all duration-300 border-border cursor-pointer group bg-card"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className={`${stat.bgColor} p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line mb-2">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Orders Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Recent Orders</h2>
                        <Link href="/account/orders">
                            <Button
                                variant="ghost"
                                className="text-primary hover:text-primary/80 hover:bg-accent font-medium"
                            >
                                View All
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recentOrders.map((order) => (
                            <RecentOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <Card className="border-border shadow-sm bg-card">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/account/orders" className="group">
                                <div className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 text-center">
                                    <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                                    <p className="text-sm font-medium text-secondary-foreground group-hover:text-primary">
                                        Track Orders
                                    </p>
                                </div>
                            </Link>
                            <Link href="/account/wishlist" className="group">
                                <div className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 text-center">
                                    <Heart className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                                    <p className="text-sm font-medium text-secondary-foreground group-hover:text-primary">
                                        Wishlist
                                    </p>
                                </div>
                            </Link>
                            <Link href="/account/addresses" className="group">
                                <div className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 text-center">
                                    <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                                    <p className="text-sm font-medium text-secondary-foreground group-hover:text-primary">
                                        Addresses
                                    </p>
                                </div>
                            </Link>
                            <Link href="/products" className="group">
                                <div className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 text-center">
                                    <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                                    <p className="text-sm font-medium text-secondary-foreground group-hover:text-primary">
                                        Shop Now
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}