import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { Package, Calendar, CreditCard, Clock, AlertCircle } from "lucide-react";
import { canCancelOrder } from "@/lib/utils/order-utils";
import CancelOrderDialog from "@/components/order/cancel-order-dialog";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/ui/custom-button";

interface OrderCardProps {
    order: Order;
}

// Format date to readable string
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// Status color mappings
const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    RETURN_REQUESTED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    RETURNED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    REFUNDED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    REFUND_REQUESTED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    REFUNDED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    PARTIALLY_REFUNDED: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

// Format payment status text for display
const formatPaymentStatus = (status: string) => {
    if (status === "REFUND_REQUESTED") return "Refund Requested";
    return status.replace(/_/g, " ");
};

// Format status text
const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
};


export default function OrderCard({ order }: OrderCardProps) {
    const firstItem = order.items[0];
    // const remainingItems = order.items.length - 1;

    // Check if order can be cancelled
    const { canCancel, daysRemaining } = canCancelOrder(order);

    return (
        <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden group">
            <CardHeader className="pb-3 bg-muted/20 border-b border-muted-foreground/5 p-5 md:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Package className="h-4 w-4 text-accent" />
                            </div>
                            <span className="h4 !text-base">
                                Order #{order.orderNumber}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 p-xs text-muted-foreground ml-11">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(order.createdAt)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                        <Badge
                            variant="secondary"
                            className={cn("px-4 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider bg-white", statusColors[order.status])}
                        >
                            {formatStatus(order.status)}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className={cn("px-4 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider bg-white", paymentStatusColors[order.paymentStatus])}
                        >
                            <CreditCard className="h-3 w-3 mr-1.5" />
                            {formatPaymentStatus(order.paymentStatus)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 md:p-8 pt-5">
                {/* First Item with Image */}
                <div className="flex gap-5 mb-4">
                    {firstItem.imageUrl && (
                        <div className="relative h-20 w-20 md:h-28 md:w-28 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src={firstItem.imageUrl}
                                alt={firstItem.productName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 ring-1 ring-black/5 ring-inset rounded-2xl" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Link
                            href={`/products/${firstItem.productSlug}`}
                            className="h4 !text-sm md:!text-base hover:text-accent transition-colors line-clamp-2 mb-1"
                        >
                            {firstItem.productName}
                        </Link>
                        <div className="flex flex-wrap gap-2 p-xs text-muted-foreground">
                            <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full text-[9px]">
                                <span className="font-bold uppercase opacity-70">Size:</span>
                                <span className="font-medium">{firstItem.size}</span>
                            </span>
                            <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full text-[9px]">
                                <span className="font-bold uppercase opacity-70">Qty:</span>
                                <span className="font-medium">{firstItem.quantity}</span>
                            </span>
                        </div>
                        <div className="mt-2 text-base font-bold">
                            ₹{firstItem.totalPrice.toFixed(2)}
                        </div>
                    </div>
                </div>

                <Separator className="my-4 bg-muted-foreground/10" />

                {/* Order Summary & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <p className="p-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Total Amount</p>
                        <p className="text-xl md:text-2xl font-bold">₹{order.totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {canCancel && daysRemaining !== null && (
                            <div className="flex items-center gap-2 p-xs text-orange-600 font-medium mr-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                    {daysRemaining === 0
                                        ? "Last day"
                                        : `${daysRemaining}d left`}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {canCancel && <CancelOrderDialog orderNumber={order.orderNumber} order={order} />}

                            <CustomButton
                                href={`/orders/${order.orderNumber}`}
                                circleSize={30}
                                circleColor="#111111"
                                textColor="#111111"
                                textHoverColor="#ffffff"
                                className="!pl-5 !pr-10 !py-2 text-[10px] uppercase tracking-widest shadow-sm"
                            >
                                View Details
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Refund Requested Notice */}
                {order.paymentStatus === "REFUND_REQUESTED" && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                            <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                        </div>
                        <span className="p-xs text-orange-800 font-medium leading-tight">Refund is being processed. It may take 5-7 business days.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

