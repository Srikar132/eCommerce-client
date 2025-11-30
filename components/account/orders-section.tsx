// components/sections/OrdersSection.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/lib/types';

interface OrdersSectionProps {
    orders: Order[];
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({ orders }) => {
    const [activeTab, setActiveTab] = useState<'expected' | 'delivered' | 'returned'>('expected');

    const filteredOrders = orders.filter(order => order.status === activeTab);

    const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
        switch (status) {
            case 'expected': return 'default';
            case 'delivered': return 'secondary';
            case 'returned': return 'outline';
            default: return 'outline';
        }
    };

    const handleViewDetails = (orderId: string) => {
        console.log('View order details:', orderId);
    };

    const handleTrackOrder = (orderId: string) => {
        console.log('Track order:', orderId);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-light tracking-wide mb-4">MY ORDERS</h1>
                <p className="text-zinc-600 font-light leading-relaxed">
                    Here you can see a history of all your recent orders along with their status, the delivery destination and details of what you have bought. This updates at regular intervals.
                </p>
            </div>

            <Tabs defaultValue="expected" className="w-full rounded-none" onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="bg-zinc-100 p-1 h-12  border  rounded-none">
                    <TabsTrigger
                        value="expected"
                        className="uppercase text-xs cursor-pointer tracking-widest rounded-none data-[state=active]:bg-black data-[state=active]:text-white h-10 px-6 font-medium"
                    >
                        Expected
                    </TabsTrigger>
                    <TabsTrigger
                        value="delivered"
                        className="uppercase text-xs cursor-pointer tracking-widest rounded-none data-[state=active]:bg-black data-[state=active]:text-white h-10 px-6 font-medium"
                    >
                        Delivered
                    </TabsTrigger>
                    <TabsTrigger
                        value="returned"
                        className="uppercase text-xs cursor-pointer tracking-widest rounded-none data-[state=active]:bg-black data-[state=active]:text-white h-10 px-6 font-medium"
                    >
                        Returned
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-8">
                    {filteredOrders.length === 0 ? (
                        <Card className="border-zinc-200">
                            <CardContent className="py-20">
                                <p className="text-center text-zinc-500 font-medium tracking-wide">There are no recent items to display</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <Card key={order.id} className="border-zinc-200 hover:border-zinc-300 transition-colors">
                                    <CardHeader className="border-b border-zinc-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg font-medium tracking-wide">{order.id}</CardTitle>
                                                <CardDescription className="mt-1 font-light">
                                                    Ordered: {new Date(order.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant={getStatusVariant(order.status)}
                                                className={`uppercase tracking-widest text-xs px-4 py-1 ${
                                                    order.status === 'expected' ? 'bg-black text-white' :
                                                        order.status === 'delivered' ? 'bg-zinc-100 text-zinc-800' :
                                                            'bg-white text-zinc-600 border-zinc-300'
                                                }`}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-6">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-6">
                                                    <div className="w-20 h-20 bg-zinc-100 flex items-center justify-center text-4xl">
                                                        {item.image}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-light text-lg tracking-wide">{item.name}</p>
                                                        <p className="text-sm text-zinc-500 font-light mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <p className="text-lg font-light">${(item.quantity * item.price).toFixed(2)}</p>
                                                </div>
                                            ))}

                                            <Separator className="bg-zinc-200" />

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-sm text-zinc-500 mb-2 font-light tracking-wide">Delivery Address</p>
                                                    <p className="text-sm font-light">{order.deliveryAddress}</p>
                                                </div>
                                                <p className="text-2xl font-light tracking-wide">Total: ${order.total.toFixed(2)}</p>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-10 px-6 border-zinc-300 hover:bg-zinc-100 font-light tracking-wide"
                                                    onClick={() => handleViewDetails(order.id)}
                                                >
                                                    View Details
                                                </Button>
                                                {order.status === 'expected' && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="h-10 px-6 bg-black hover:bg-zinc-800 font-light tracking-wide"
                                                        onClick={() => handleTrackOrder(order.id)}
                                                    >
                                                        Track Order
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};