
import { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import OrderStatusTimeline from "./order-status-timeline";
import OrderItemsList from "./order-items-list";
import CancelOrderDialog from "./cancel-order-dialog";
import ReturnOrderDialog from "./return-order-dialog";
import RetryPaymentButton from "./retry-payment-button";

interface OrderTrackingClientProps {
    order: Order;
}

export default function OrderTrackingClient({ order }: OrderTrackingClientProps) {
    // Determine if order can be cancelled
    const canCancel = ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status);

    // Determine if order can be returned
    const canReturn = order.status === "DELIVERED";

    // Determine if payment can be retried
    const canRetryPayment = order.paymentStatus === "PENDING" && order.status === "PENDING";

    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "PENDING":
            case "PROCESSING":
                return "secondary";
            case "CONFIRMED":
            case "SHIPPED":
                return "default";
            case "DELIVERED":
                return "default";
            case "CANCELLED":
            case "RETURNED":
                return "destructive";
            case "RETURN_REQUESTED":
                return "outline";
            case "REFUNDED":
                return "secondary";
            default:
                return "outline";
        }
    };

    // Get payment status badge variant
    const getPaymentStatusVariant = (status: string) => {
        switch (status) {
            case "PAID":
                return "default";
            case "PENDING":
            case "PROCESSING":
                return "secondary";
            case "FAILED":
                return "destructive";
            case "REFUNDED":
            case "PARTIALLY_REFUNDED":
                return "outline";
            default:
                return "outline";
        }
    };

    // Format status text
    const formatStatus = (status: string) => {
        return status.replace(/_/g, " ");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/orders">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold">Order #{order.orderNumber}</h1>
                    <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(order.status)} className="text-sm">
                    {formatStatus(order.status)}
                </Badge>
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="text-sm">
                    Payment: {formatStatus(order.paymentStatus)}
                </Badge>
            </div>

            {/* Payment Pending Alert */}
            {canRetryPayment && (
                <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                                    Payment Pending
                                </h3>
                                <p className="text-sm text-orange-800 dark:text-orange-200">
                                    Complete your payment to confirm this order. Your order will be processed once payment is received.
                                </p>
                            </div>
                            <RetryPaymentButton orderNumber={order.orderNumber} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Order Status Timeline */}
            <OrderStatusTimeline order={order} />

            {/* Action Buttons */}
            {(canCancel || canReturn) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {canCancel && (
                            <CancelOrderDialog orderNumber={order.orderNumber} />
                        )}
                        {canReturn && (
                            <ReturnOrderDialog orderNumber={order.orderNumber} />
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Tracking Information */}
            {order.trackingNumber && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Tracking Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Tracking Number</span>
                            <span className="text-sm font-medium">{order.trackingNumber}</span>
                        </div>
                        {order.carrier && (
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Carrier</span>
                                <span className="text-sm font-medium">{order.carrier}</span>
                            </div>
                        )}
                        {order.estimatedDeliveryDate && (
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                                <span className="text-sm font-medium">
                                    {new Date(order.estimatedDeliveryDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Order Items */}
            <OrderItemsList items={order.items} />

            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (18%)</span>
                        <span>₹{order.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                            {order.shippingCost === 0 ? (
                                <span className="text-green-600">FREE</span>
                            ) : (
                                `₹${order.shippingCost.toFixed(2)}`
                            )}
                        </span>
                    </div>
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-₹{order.discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Payment Method */}
                    {order.paymentMethod && (
                        <div className="pt-2 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="capitalize">{order.paymentMethod}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Additional Notes */}
            {order.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </CardContent>
                </Card>
            )}

            {/* Cancellation/Return Information */}
            {order.cancellationReason && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                            <XCircle className="w-5 h-5" />
                            Cancellation Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cancelled On</span>
                            <span className="text-sm">
                                {order.cancelledAt && new Date(order.cancelledAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Reason</p>
                            <p className="text-sm">{order.cancellationReason}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {order.returnReason && (
                <Card className="border-orange-500">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                            <RotateCcw className="w-5 h-5" />
                            Return Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Return Requested On</span>
                            <span className="text-sm">
                                {order.returnRequestedAt && new Date(order.returnRequestedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Reason</p>
                            <p className="text-sm">{order.returnReason}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
