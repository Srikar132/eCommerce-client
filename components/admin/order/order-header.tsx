"use client";

import { ArrowLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { OrderStatus } from "@/types/orders";
import { formatOrderDate, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils/order.utils";

// ============================================================================
// TYPES
// ============================================================================

interface OrderHeaderProps {
    orderNumber: string;
    status: OrderStatus;
    createdAt: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OrderHeader({ orderNumber, status, createdAt }: OrderHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6 pb-6 border-b border-border/60 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-10 w-10 rounded-full border-border/50 hover:bg-muted/50 transition-all hover:scale-105"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90">
                                Order #{orderNumber}
                            </h1>
                            <Badge className={`${getOrderStatusColor(status)} border-0 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                                {getOrderStatusLabel(status)}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-primary/60" />
                            Placed on {formatOrderDate(createdAt)}
                        </p>
                    </div>
                </div>

                <Breadcrumb className="hidden md:block">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/admin"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/admin/orders"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Orders
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-bold text-foreground">
                                {orderNumber}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    );
}
