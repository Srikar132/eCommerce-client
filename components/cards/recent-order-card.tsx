import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderResponse } from '@/lib/api/orders';
import { OrderStatus } from '@/types';

interface RecentOrderCardProps {
    order: OrderResponse;
}

const statusStyles: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-[oklch(0.82_0.05_60)] text-[oklch(0.42_0.08_60)]',
    [OrderStatus.CONFIRMED]: 'bg-[oklch(0.85_0.05_220)] text-[oklch(0.45_0.08_220)]',
    [OrderStatus.PROCESSING]: 'bg-[oklch(0.85_0.05_240)] text-[oklch(0.45_0.08_240)]',
    [OrderStatus.SHIPPED]: 'bg-[oklch(0.85_0.05_200)] text-[oklch(0.45_0.08_200)]',
    [OrderStatus.DELIVERED]: 'bg-[oklch(0.85_0.05_140)] text-[oklch(0.35_0.08_140)]',
    [OrderStatus.CANCELLED]: 'bg-[oklch(0.85_0.05_25)] text-[oklch(0.42_0.12_25)]',
    [OrderStatus.RETURN_REQUESTED]: 'bg-[oklch(0.82_0.05_45)] text-[oklch(0.42_0.08_45)]',
    [OrderStatus.RETURNED]: 'bg-[oklch(0.85_0.05_25)] text-[oklch(0.42_0.12_25)]',
    [OrderStatus.REFUNDED]: 'bg-[oklch(0.85_0.05_180)] text-[oklch(0.45_0.08_180)]',
};

const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.CONFIRMED]: 'Confirmed',
    [OrderStatus.PROCESSING]: 'Processing',
    [OrderStatus.SHIPPED]: 'Shipped',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
    [OrderStatus.RETURN_REQUESTED]: 'Return Requested',
    [OrderStatus.RETURNED]: 'Returned',
    [OrderStatus.REFUNDED]: 'Refunded',
};

export default function RecentOrderCard({ order }: RecentOrderCardProps) {
    // Format date from ISO string
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-border bg-card">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">#{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{orderDate} · {order.items.length} items</p>
                    </div>
                    <Badge className={`${statusStyles[order.status]} px-3 py-1 text-xs font-medium border-none`}>
                        {statusLabels[order.status]}
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
                    <Link href={`/account/orders/${order.orderNumber}`}>
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
