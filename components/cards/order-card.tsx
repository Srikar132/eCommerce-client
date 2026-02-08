import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";
import { Package, Calendar, CreditCard, MapPin, ChevronRight } from "lucide-react";

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
    REFUNDED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

// Format status text
const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
};

export default function OrderCard({ order }: OrderCardProps) {
    const firstItem = order.items[0];
    const remainingItems = order.items.length - 1;

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-sm">
                                Order #{order.orderNumber}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.createdAt)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="outline"
                            className={statusColors[order.status]}
                        >
                            {formatStatus(order.status)}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={paymentStatusColors[order.paymentStatus]}
                        >
                            <CreditCard className="h-3 w-3 mr-1" />
                            {formatStatus(order.paymentStatus)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4 pb-3">
                {/* First Item with Image */}
                <div className="flex gap-3 mb-3">
                    {firstItem.imageUrl && (
                        <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden border">
                            <Image
                                src={firstItem.imageUrl}
                                alt={firstItem.productName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <Link
                            href={`/products/${firstItem.productSlug}`}
                            className="font-medium text-sm hover:underline line-clamp-2"
                        >
                            {firstItem.productName}
                        </Link>
                        <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                                <span className="font-medium">Size:</span>
                                {firstItem.size}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                                <span className="font-medium">Color:</span>
                                {firstItem.color}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                                <span className="font-medium">Qty:</span>
                                {firstItem.quantity}
                            </span>
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                            ₹{firstItem.totalPrice.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Additional Items Count */}
                {remainingItems > 0 && (
                    <div className="text-xs text-muted-foreground pl-22">
                        + {remainingItems} more {remainingItems === 1 ? "item" : "items"}
                    </div>
                )}

                <Separator className="my-3" />

                {/* Order Summary */}
                <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.taxAmount > 0 && (
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tax (GST)</span>
                            <span>₹{order.taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {order.shippingCost > 0 && (
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>₹{order.shippingCost.toFixed(2)}</span>
                        </div>
                    )}
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                            <span>Discount</span>
                            <span>-₹{order.discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-base">
                        <span>Total Amount</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                    <div className="mt-3 p-2 bg-muted/50 rounded-md text-xs">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Tracking:</span>
                            <span className="font-medium">{order.trackingNumber}</span>
                        </div>
                    </div>
                )}

                {/* Delivery Date */}
                {order.estimatedDeliveryDate && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">Estimated Delivery:</span>{" "}
                        {formatDate(order.estimatedDeliveryDate)}
                    </div>
                )}
            </CardContent>

            <CardFooter className="bg-muted/20 pt-3 pb-3">
                <Link
                    href={`/orders/${order.orderNumber}`}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium hover:underline"
                >
                    View Order Details
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}
