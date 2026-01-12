import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface RecentOrderCardProps {
    order: Order;
}

const statusStyles = {
    Processing: 'bg-[oklch(0.82_0.05_60)] text-[oklch(0.42_0.08_60)]',
    Shipped: 'bg-[oklch(0.85_0.05_220)] text-[oklch(0.45_0.08_220)]',
    Delivered: 'bg-[oklch(0.85_0.05_140)] text-[oklch(0.35_0.08_140)]',
    Cancelled: 'bg-[oklch(0.85_0.05_25)] text-[oklch(0.42_0.12_25)]',
};

export default function RecentOrderCard({ order }: RecentOrderCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-border bg-card">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">#{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{order.date} · {order.items.length} items</p>
                    </div>
                    <Badge className={`${statusStyles[order.status]} px-3 py-1 text-xs font-medium border-none`}>
                        {order.status}
                    </Badge>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {order.items.slice(0, 3).map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index === 0 ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                        ))}
                    </div>
                    <Link href={`/account/orders/${order.id}`}>
                        <Button
                            variant="ghost"
                            className="bg-accent text-primary hover:bg-accent/80 rounded-full px-6 py-2 text-sm font-medium"
                        >
                            View Order
                        </Button>
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xl font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
    );
}
