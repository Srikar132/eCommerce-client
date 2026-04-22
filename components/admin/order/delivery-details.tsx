"use client";

import React from "react";
import { Truck, ExternalLink, Calendar, PackageCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/orders";

interface DeliveryDetailsProps {
    status: OrderStatus;
    trackingNumber?: string | null;
    carrier?: string | null;
    estimatedDeliveryDate?: string | null;
    deliveredAt?: string | null;
}

export function DeliveryDetails({
    status,
    trackingNumber,
    carrier,
    estimatedDeliveryDate,
    deliveredAt
}: DeliveryDetailsProps) {
    const isShipped = ["SHIPPED", "DELIVERED"].includes(status);
    const isDelivered = status === "DELIVERED";

    return (
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-base font-bold flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 shadow-sm border border-blue-500/10">
                        <Truck className="h-5 w-5" />
                    </div>
                    Delivery Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
                {!isShipped && (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 bg-muted/5 rounded-2xl border border-dashed border-border/60">
                        <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground/70">Awaiting Shipment</p>
                            <p className="text-[11px] text-muted-foreground px-4 leading-relaxed">Tracking information will be available once the order is shipped.</p>
                        </div>
                    </div>
                )}

                {isShipped && (
                    <>
                        {/* Carrier & Tracking */}
                        <div className="p-4 rounded-2xl bg-muted/10 border border-border/40 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Logistics Partner</span>
                                <span className="text-xs font-black text-foreground/90 uppercase tracking-tight">{carrier || "Standard Shipping"}</span>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-border/20">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tracking Number</span>
                                <div className="flex items-center justify-between">
                                    <code className="text-sm font-black font-mono text-primary bg-primary/5 px-2 py-1 rounded-md">{trackingNumber || "N/A"}</code>
                                    <Badge variant="outline" className="h-6 text-[9px] font-bold uppercase tracking-widest bg-background border-border/60 flex gap-1 items-center cursor-pointer hover:bg-muted/30 transition-colors">
                                        Track <ExternalLink className="h-2.5 w-2.5" />
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Timeline / Dates */}
                        <div className="p-4 rounded-2xl bg-muted/10 border border-border/40 space-y-3">
                            {isDelivered ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/10">
                                        <PackageCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivered On</p>
                                        <p className="text-sm font-bold text-foreground/90">
                                            {deliveredAt ? new Date(deliveredAt).toLocaleDateString("en-IN", {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            }) : "Pending"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/10">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Est. Delivery</p>
                                        <p className="text-sm font-bold text-foreground/90">
                                            {estimatedDeliveryDate ? new Date(estimatedDeliveryDate).toLocaleDateString("en-IN", {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            }) : "7 - 10 Business Days"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
