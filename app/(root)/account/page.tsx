
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
            <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                {/* Header Section - Enhanced with gradient and better spacing */}
                <Card className="mb-8 overflow-hidden border-border bg-linear-to-br from-card via-card to-accent/10 shadow-lg">
                    <CardContent className="p-8 lg:p-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-accent/30 transition-transform duration-300 group-hover:scale-105">
                                        <span className="text-4xl lg:text-5xl font-bold text-primary-foreground">
                                            {userData.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-card"></div>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-3xl lg:text-4xl font-serif font-light text-foreground">
                                        {userData.name}
                                    </h1>
                                    <p className="text-base text-muted-foreground flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                        {userData.email}
                                    </p>
                                    <p className="text-base text-muted-foreground flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                        {userData.phone}
                                    </p>
                                </div>
                            </div>
                            <Link href="/account/account-details">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full h-12 w-12 shadow-md transition-all duration-300 hover:scale-110"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {dashboardStats.map((stat, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border cursor-pointer group bg-card hover:-translate-y-1"
                        >
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div
                                        className={`${stat.bgColor} p-5 rounded-2xl mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}
                                    >
                                        <stat.icon className={`h-7 w-7 ${stat.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground whitespace-pre-line leading-relaxed">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Orders Section */}
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
                        {recentOrders.map((order) => (
                            <RecentOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <Card className="border-border shadow-lg bg-card overflow-hidden">
                    <CardContent className="p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-serif font-light text-foreground mb-2">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground">Access your account features</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/account/orders" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Package className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Track Orders
                                    </p>
                                </div>
                            </Link>
                            <Link href="/account/wishlist" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Wishlist
                                    </p>
                                </div>
                            </Link>
                            <Link href="/account/addresses" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Addresses
                                    </p>
                                </div>
                            </Link>
                            <Link href="/products" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <ShoppingBag className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
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