"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, MapPin, CreditCard, Calendar, User, Mail, Phone, Hash, Truck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { OrderStatusProgress, OrderItemCard, OrderStatusUpdate, RefundOrderDialog } from "@/components/admin/order";
import { OrderStatus } from "@/types/orders";
import { toast } from "sonner";

interface OrderDetailsClientProps {
    order: {
        id: string;
        orderNumber: string;
        status: string;
        paymentStatus: string;
        paymentMethod?: string | null;
        razorpayOrderId?: string | null;
        razorpayPaymentId?: string | null;
        subtotal: number;
        taxAmount: number;
        shippingCost: number;
        discountAmount: number;
        totalAmount: number;
        trackingNumber?: string | null;
        carrier?: string | null;
        estimatedDeliveryDate?: string | null;
        deliveredAt?: string | null;
        cancelledAt?: string | null;
        cancellationReason?: string | null;
        returnRequestedAt?: string | null;
        returnReason?: string | null;
        notes?: string | null;
        createdAt: string;
        updatedAt: string;
        userId: string;
        userName?: string | null;
        userEmail?: string | null;
        userPhone?: string | null;
        items: {
            id: string;
            productId: string;
            productName: string;
            productSlug: string;
            variantId: string;
            size: string;
            color: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            productionStatus: string;
            imageUrl?: string | null;
        }[];
        shippingAddress?: {
            id: string;
            fullName: string;
            phone: string;
            addressLine1: string;
            addressLine2?: string | null;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        } | null;
        billingAddress?: {
            id: string;
            fullName: string;
            phone: string;
            addressLine1: string;
            addressLine2?: string | null;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        } | null;
    };
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getPaymentStatusColor(status: string) {
    switch (status) {
        case "PAID":
            return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "FAILED":
            return "bg-red-100 text-red-800 border-red-200";
        case "REFUND_REQUESTED":
            return "bg-orange-100 text-orange-800 border-orange-200";
        case "REFUNDED":
            return "bg-purple-100 text-purple-800 border-purple-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

function getPaymentStatusLabel(status: string) {
    switch (status) {
        case "REFUND_REQUESTED":
            return "Refund Requested";
        case "PARTIALLY_REFUNDED":
            return "Partially Refunded";
        default:
            return status;
    }
}

function AddressCard({ address, title }: { address: NonNullable<OrderDetailsClientProps['order']['shippingAddress']>; title: string }) {
    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {title}
            </h4>
            <div className="text-sm space-y-1">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="text-muted-foreground">{address.phone}</p>
            </div>
        </div>
    );
}

export function OrderDetailsClient({ order }: OrderDetailsClientProps) {
    const router = useRouter();
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status as OrderStatus);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold">Order {order.orderNumber}</h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(order.orderNumber, "Order number")}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin/orders">Orders</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{order.orderNumber}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Status Progress */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-base">Order Status</CardTitle>
                        <OrderStatusUpdate
                            orderId={order.id}
                            currentStatus={currentStatus}
                            onStatusUpdate={setCurrentStatus}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <OrderStatusProgress currentStatus={currentStatus} />
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Items - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Order Items ({order.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {order.items.map((item) => (
                                <OrderItemCard key={item.id} item={item} />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    {(order.shippingAddress || order.billingAddress) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Addresses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {order.shippingAddress && (
                                        <AddressCard address={order.shippingAddress} title="Shipping Address" />
                                    )}
                                    {order.billingAddress && (
                                        <AddressCard address={order.billingAddress} title="Billing Address" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Takes 1 column */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {order.userName && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.userName}</span>
                                </div>
                            )}
                            {order.userEmail && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <Link
                                        href={`mailto:${order.userEmail}`}
                                        className="text-primary hover:underline"
                                    >
                                        {order.userEmail}
                                    </Link>
                                </div>
                            )}
                            {order.userPhone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <Link
                                        href={`tel:${order.userPhone}`}
                                        className="text-primary hover:underline"
                                    >
                                        {order.userPhone}
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                    {getPaymentStatusLabel(order.paymentStatus)}
                                </Badge>
                            </div>
                            {order.paymentMethod && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Method
                                    </span>
                                    <span className="capitalize">{order.paymentMethod}</span>
                                </div>
                            )}
                            {order.razorpayPaymentId && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        Payment ID
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-xs font-mono"
                                        onClick={() => copyToClipboard(order.razorpayPaymentId!, "Payment ID")}
                                    >
                                        {order.razorpayPaymentId.slice(0, 12)}...
                                        <Copy className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            )}

                            {/* Refund Button for REFUND_REQUESTED orders */}
                            {order.paymentStatus === "REFUND_REQUESTED" && (
                                <div className="pt-2 border-t">
                                    <RefundOrderDialog
                                        orderId={order.id}
                                        orderNumber={order.orderNumber}
                                        totalAmount={order.totalAmount}
                                        paymentId={order.razorpayPaymentId}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (GST)</span>
                                <span>₹{order.taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost.toLocaleString()}`}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Info */}
                    {(order.trackingNumber || order.carrier) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Shipping
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.carrier && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Carrier</span>
                                        <span>{order.carrier}</span>
                                    </div>
                                )}
                                {order.trackingNumber && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Tracking</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 font-mono"
                                            onClick={() => copyToClipboard(order.trackingNumber!, "Tracking number")}
                                        >
                                            {order.trackingNumber}
                                            <Copy className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                {order.estimatedDeliveryDate && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Est. Delivery</span>
                                        <span>{formatDate(order.estimatedDeliveryDate)}</span>
                                    </div>
                                )}
                                {order.deliveredAt && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivered</span>
                                        <span>{formatDate(order.deliveredAt)}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes / Cancellation / Return Reason */}
                    {(order.notes || order.cancellationReason || order.returnReason) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.notes && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Order Notes</p>
                                        <p className="text-sm">{order.notes}</p>
                                    </div>
                                )}
                                {order.cancellationReason && (
                                    <div>
                                        <p className="text-xs text-red-500 mb-1">Cancellation Reason</p>
                                        <p className="text-sm">{order.cancellationReason}</p>
                                    </div>
                                )}
                                {order.returnReason && (
                                    <div>
                                        <p className="text-xs text-orange-500 mb-1">Return Reason</p>
                                        <p className="text-sm">{order.returnReason}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Created</span>
                                <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Updated</span>
                                <span>{formatDate(order.updatedAt)}</span>
                            </div>
                            {order.cancelledAt && (
                                <div className="flex justify-between text-sm text-red-500">
                                    <span>Cancelled</span>
                                    <span>{formatDate(order.cancelledAt)}</span>
                                </div>
                            )}
                            {order.returnRequestedAt && (
                                <div className="flex justify-between text-sm text-orange-500">
                                    <span>Return Requested</span>
                                    <span>{formatDate(order.returnRequestedAt)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
