
import { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XCircle, RotateCcw, Clock } from "lucide-react";
import Image from "next/image";
import OrderStatusTimeline from "./order-status-timeline";
import OrderItemsList from "./order-items-list";
import CancelOrderDialog from "./cancel-order-dialog";
import { canCancelOrder } from "@/lib/utils/order-utils";
import { cn } from "@/lib/utils";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";
import CustomButton from "@/components/ui/custom-button";
import CustomButton2 from "@/components/ui/custom-button-2";

interface OrderTrackingClientProps {
    order: Order;
}


export default function OrderTrackingClient({ order }: OrderTrackingClientProps) {
    // Determine if order can be cancelled using the time-limited logic
    const { canCancel, daysRemaining } = canCancelOrder(order);

    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "PENDING":
            case "PROCESSING":
                return "secondary";
            case "CONFIRMED":
            case "SHIPPED":
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
            case "REFUND_REQUESTED":
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
        <div className="space-y-12 pb-20">
            <BreadcrumbNavigation />

            {/* Breadcrumb Navigation */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="h1 mb-2">Order #{order.orderNumber}</h1>
                    <p className="p-base text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3">
                    <Badge variant={getStatusVariant(order.status)} className="px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {formatStatus(order.status)}
                    </Badge>
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-sm">
                        Payment: {formatStatus(order.paymentStatus)}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline and Items */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Status Timeline */}
                    <OrderStatusTimeline order={order} />

                    {/* Order Items */}
                    <OrderItemsList items={order.items} />
                </div>

                {/* Right Column: Summary and Actions */}
                <div className="space-y-8">
                    {/* Action Buttons */}
                    {canCancel && (
                        <Card className="rounded-3xl border-none shadow-sm bg-secondary/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold">Order Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {daysRemaining !== null && daysRemaining <= 3 && (
                                    <div className="flex items-center gap-2 p-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {daysRemaining === 0
                                                ? "Last day to cancel this order"
                                                : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left to cancel`}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <CancelOrderDialog orderNumber={order.orderNumber} order={order} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Summary */}
                    <Card className="rounded-3xl border-none shadow-sm bg-muted/30 overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-content space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between p-base">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between p-base">
                                    <span className="text-muted-foreground">Tax (18%)</span>
                                    <span className="font-medium">₹{order.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between p-base">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">
                                        {order.shippingCost === 0 ? (
                                            <span className="text-accent font-bold">FREE</span>
                                        ) : (
                                            `₹${order.shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between p-base text-accent">
                                        <span className="font-medium">Discount</span>
                                        <span className="font-bold">-₹{order.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-muted-foreground/10" />

                            <div className="flex justify-between items-center py-2">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold">₹{order.totalAmount.toFixed(2)}</span>
                            </div>

                            {/* Payment Method */}
                            {order.paymentMethod && (
                                <div className="pt-4 mt-2 border-t border-muted-foreground/10">
                                    <div className="flex justify-between p-sm">
                                        <span className="text-muted-foreground">Payment Method</span>
                                        <span className="capitalize font-medium">{order.paymentMethod}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    {order.notes && (
                        <Card className="rounded-3xl border-none shadow-sm bg-muted/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold">Order Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-content pt-0">
                                <p className="p-sm text-muted-foreground italic">&quot;{order.notes}&quot;</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Cancellation/Return Information */}
                    {(order.cancellationReason || order.returnReason) && (
                        <Card className={cn(
                            "rounded-3xl border-none shadow-sm",
                            order.cancellationReason ? "bg-destructive/5" : "bg-orange-50"
                        )}>
                            <CardHeader className="pb-2">
                                <CardTitle className={cn(
                                    "text-lg font-bold flex items-center gap-2",
                                    order.cancellationReason ? "text-destructive" : "text-orange-600"
                                )}>
                                    {order.cancellationReason ? (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            Cancellation Details
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw className="w-5 h-5" />
                                            Return Details
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-content pt-2 space-y-4">
                                <div className="flex justify-between p-sm">
                                    <span className="text-muted-foreground">
                                        {order.cancellationReason ? "Cancelled On" : "Return Requested On"}
                                    </span>
                                    <span className="font-medium">
                                        {order.cancellationReason
                                            ? order.cancelledAt && new Date(order.cancelledAt).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric"
                                            })
                                            : order.returnRequestedAt && new Date(order.returnRequestedAt).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric"
                                            })
                                        }
                                    </span>
                                </div>
                                <div className="bg-white/50 p-4 rounded-2xl">
                                    <p className="p-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Reason</p>
                                    <p className="p-base">{order.cancellationReason || order.returnReason}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Promotional Section */}
            <PromotionalSection />
        </div>
    );
}

function PromotionalSection() {
    return (
        <section className="pt-20 border-t border-muted-foreground/10">
            <div className="text-center mb-16">
                <h2 className="h1 mb-4">Feel good & enjoy every day</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Card 01 */}
                <div className="group relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                    <Image
                        src="/fabric_shorts_detail_1776732839257.png"
                        alt="Fluffy, comfy shorts"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-10 left-10 text-white">
                        <span className="text-sm font-bold uppercase tracking-widest mb-2 block opacity-80">01.</span>
                        <h3 className="text-3xl font-bold max-w-[200px] leading-tight">Fluffy, comfy shorts</h3>
                    </div>
                    <div className="absolute bottom-10 right-10">
                        <CustomButton2
                            href="/products"
                            bgColor="#ffffff"
                            fillColor="#111111"
                            textColor="#111111"
                            textHoverColor="#ffffff"
                            className="!px-6 !py-2.5 shadow-xl"
                        >
                            Shop
                        </CustomButton2>
                    </div>
                </div>

                {/* Card 02 */}
                <div className="group relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                    <Image
                        src="/denim_waistband_detail_1776732858052.png"
                        alt="Elastic waistband"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-10 left-10 text-white">
                        <span className="text-sm font-bold uppercase tracking-widest mb-2 block opacity-80">02.</span>
                        <h3 className="text-3xl font-bold max-w-[200px] leading-tight">Elastic waistband for comfort</h3>
                    </div>
                    <div className="absolute bottom-10 right-10">
                        <CustomButton2
                            href="/products"
                            bgColor="#ffffff"
                            fillColor="#111111"
                            textColor="#111111"
                            textHoverColor="#ffffff"
                            className="!px-6 !py-2.5 shadow-xl"
                        >
                            Shop
                        </CustomButton2>
                    </div>
                </div>

                {/* Card 03 */}
                <div className="group relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                    <Image
                        src="/ruffled_hems_detail_1776732878606.png"
                        alt="Playful ruffled hems"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-10 left-10 text-white">
                        <span className="text-sm font-bold uppercase tracking-widest mb-2 block opacity-80">03.</span>
                        <h3 className="text-3xl font-bold max-w-[200px] leading-tight">Playful ruffled hems for fun</h3>
                    </div>
                    <div className="absolute bottom-10 right-10">
                        <CustomButton2
                            href="/products"
                            bgColor="#ffffff"
                            fillColor="#111111"
                            textColor="#111111"
                            textHoverColor="#ffffff"
                            className="!px-6 !py-2.5 shadow-xl"
                        >
                            Shop
                        </CustomButton2>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <CustomButton
                    href="/products"
                    circleSize={30}
                    circleColor="#9BA88B"
                    textColor="#000000"
                    textHoverColor="#ffffff"
                    className="shadow-xl"
                >
                    Shop More
                </CustomButton>
            </div>
        </section>
    );
}
