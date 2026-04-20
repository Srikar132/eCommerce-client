"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useLowStockProducts } from "@/lib/tanstack/queries/dashboard.queries";

interface InventoryItemProps {
    productId: string;
    name: string;
    sku: string;
    totalStock: number;
}

function InventoryItem({ productId, name, sku, totalStock }: InventoryItemProps) {
    const isOutOfStock = totalStock === 0;

    return (
        <Link href={`/admin/products/${productId}`} className="block">
            <div className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-accent/50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isOutOfStock ? 'bg-rose-500/10' : 'bg-amber-500/10'} shrink-0 group-hover:scale-105 transition-transform`}>
                        {isOutOfStock ? (
                            <Package className="h-5 w-5 text-rose-600" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base truncate">{name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-mono font-medium">{sku}</p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`shrink-0 ml-2 text-[10px] sm:text-xs font-bold py-0.5 px-2 ${isOutOfStock
                        ? 'border-rose-500/30 text-rose-600 bg-rose-500/5'
                        : 'border-amber-500/30 text-amber-600 bg-amber-500/5'
                        }`}
                >
                    {isOutOfStock ? 'Out of Stock' : `${totalStock} left`}
                </Badge>
            </div>
        </Link>
    );
}

function InventoryItemSkeleton() {
    return (
        <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
        </div>
    );
}

export function InventoryAlerts() {
    const { data: products, isLoading } = useLowStockProducts(10);

    const lowStockProducts = products || [];
    const outOfStockCount = lowStockProducts.filter(p => p.totalStock === 0).length;
    const lowStockCount = lowStockProducts.filter(p => p.totalStock > 0).length;

    if (isLoading) {
        return (
            <Card className="border border-border/40 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Inventory Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {[1, 2, 3].map((i) => (
                            <InventoryItemSkeleton key={i} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!lowStockProducts.length) {
        return (
            <Card className="border border-border/40 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Inventory Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Package className="h-6 w-6 text-emerald-500" />
                        </div>
                        <p className="font-medium">Stock levels healthy</p>
                        <p className="text-sm text-muted-foreground mt-1">All products have sufficient inventory</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border/40 bg-card shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Inventory Alerts
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {outOfStockCount > 0 && (
                            <Badge variant="outline" className="border-rose-500/50 text-rose-600 bg-rose-500/5 text-sm">
                                {outOfStockCount} out
                            </Badge>
                        )}
                        {lowStockCount > 0 && (
                            <Badge variant="outline" className="border-amber-500/50 text-amber-600 bg-amber-500/5 text-sm">
                                {lowStockCount} low
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="divide-y divide-border/40">
                    {lowStockProducts.slice(0, 5).map((product) => (
                        <InventoryItem
                            key={product.id}
                            productId={product.id}
                            name={product.name}
                            sku={product.sku}
                            totalStock={product.totalStock}
                        />
                    ))}
                </div>

                {lowStockProducts.length > 5 && (
                    <Button variant="ghost" size="sm" asChild className="w-full mt-4 text-sm h-9 text-muted-foreground hover:text-primary">
                        <Link href="/admin/products?stock=low">
                            View all {lowStockProducts.length} items
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
