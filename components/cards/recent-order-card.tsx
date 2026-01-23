import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderResponse } from '@/lib/api/orders';
import { orderStatusStyles, orderStatusLabels } from '@/lib/utils/order-utils';
import { formatDate } from '@/lib/utils';

interface RecentOrderCardProps {
    order: OrderResponse;
}

export default function RecentOrderCard({ order }: RecentOrderCardProps) {
    // Format date from ISO string
    const orderDate = formatDate(order.createdAt, {
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
                    <Badge className={`${orderStatusStyles[order.status]} px-3 py-1 text-xs font-medium border-none`}>
                        {orderStatusLabels[order.status]}
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
                    <Link href={`/orders/${order.orderNumber}`}>
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
