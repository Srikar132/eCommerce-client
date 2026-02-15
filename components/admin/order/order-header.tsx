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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-xl border-border hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Order #{orderNumber}
                        </h1>
                        <Badge className={`${getOrderStatusColor(status)} border-0 rounded-lg`}>
                            {getOrderStatusLabel(status)}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Placed on {formatOrderDate(createdAt)}
                    </p>
                </div>
            </div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href="/admin"
                            className="text-primary hover:text-primary/80"
                        >
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href="/admin/orders"
                            className="text-primary hover:text-primary/80"
                        >
                            Orders
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium">
                            {orderNumber}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
