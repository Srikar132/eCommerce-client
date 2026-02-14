"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, MapPin, CreditCard, Calendar, User, Mail, Phone, Hash, Truck, FileText, Package, CheckCircle2, Clock, XCircle, RefreshCcw, IndianRupee } from "lucide-react";
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

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function getPaymentStatusConfig(status: string) {
    const configs: Record<string, { bg: string; text: string; labelColor: string; icon: typeof CheckCircle2 }> = {
        PAID: { bg: "bg-emerald-500", text: "text-white", labelColor: "text-emerald-400", icon: CheckCircle2 },
        PENDING: { bg: "bg-amber-500", text: "text-white", labelColor: "text-amber-400", icon: Clock },
        FAILED: { bg: "bg-red-500", text: "text-white", labelColor: "text-red-400", icon: XCircle },
        REFUND_REQUESTED: { bg: "bg-orange-500", text: "text-white", labelColor: "text-orange-400", icon: RefreshCcw },
        REFUNDED: { bg: "bg-violet-500", text: "text-white", labelColor: "text-violet-400", icon: CheckCircle2 },
        PROCESSING: { bg: "bg-blue-500", text: "text-white", labelColor: "text-blue-400", icon: Clock },
    };
    return configs[status] || { bg: "bg-gray-500", text: "text-white", labelColor: "text-gray-400", icon: Clock };
}

function getPaymentBadgeStyle(status: string) {
    const styles: Record<string, string> = {
        PAID: "bg-emerald-500/20 text-emerald-400",
        PENDING: "bg-amber-500/20 text-amber-400",
        FAILED: "bg-red-500/20 text-red-400",
        REFUND_REQUESTED: "bg-orange-500/20 text-orange-400",
        REFUNDED: "bg-violet-500/20 text-violet-400",
        PROCESSING: "bg-blue-500/20 text-blue-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
}

function getPaymentStatusLabel(status: string) {
    const labels: Record<string, string> = {
        REFUND_REQUESTED: "Refund Requested",
        PARTIALLY_REFUNDED: "Partially Refunded",
    };
    return labels[status] || status;
}

function AddressCard({ address, title, icon: Icon = MapPin }: { address: NonNullable<OrderDetailsClientProps['order']['shippingAddress']>; title: string; icon?: typeof MapPin }) {
    return (
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Icon className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm">{title}</h4>
            </div>
            <div className="text-sm space-y-1 pl-10">
                <p className="font-medium text-foreground">{address.fullName}</p>
                <p className="text-muted-foreground">{address.addressLine1}</p>
                {address.addressLine2 && <p className="text-muted-foreground">{address.addressLine2}</p>}
                <p className="text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
                <p className="text-muted-foreground">{address.country}</p>
                <p className="text-primary font-medium mt-2">{address.phone}</p>
            </div>
        </div>
    );
}

export function OrderDetailsClient({ order }: OrderDetailsClientProps) {
    const router = useRouter();
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status as OrderStatus);
    const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);
    const PaymentIcon = paymentStatusConfig.icon;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.back()}
                            className="h-10 w-10 rounded-xl border-border hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{order.orderNumber}</h1>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-muted"
                                    onClick={() => copyToClipboard(order.orderNumber, "Order number")}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin" className="text-primary hover:text-primary/80">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/orders" className="text-primary hover:text-primary/80">Orders</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-medium">{order.orderNumber}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                            <IndianRupee className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Total Amount</p>
                            <p className="text-lg font-bold text-emerald-400">{formatCurrency(order.totalAmount)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Items</p>
                            <p className="text-lg font-bold">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${paymentStatusConfig.bg}`}>
                            <PaymentIcon className={`h-5 w-5 ${paymentStatusConfig.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Payment</p>
                            <p className={`text-sm font-semibold ${paymentStatusConfig.labelColor}`}>{getPaymentStatusLabel(order.paymentStatus)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Customer</p>
                            <p className="text-sm font-semibold truncate max-w-30">{order.userName || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Progress */}
            <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Truck className="h-4 w-4 text-white" />
                            </div>
                            Order Status
                        </CardTitle>
                        <OrderStatusUpdate
                            orderId={order.id}
                            currentStatus={currentStatus}
                            onStatusUpdate={setCurrentStatus}
                        />
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <OrderStatusProgress currentStatus={currentStatus} />
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Items - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                Order Items
                                <Badge variant="secondary" className="ml-2 rounded-full px-3">
                                    {order.items.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 divide-y divide-border">
                            {order.items.map((item) => (
                                <OrderItemCard key={item.id} item={item} />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    {(order.shippingAddress || order.billingAddress) && (
                        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    Addresses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
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

                    {/* Order Summary - Moved here */}
                    <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                                    <IndianRupee className="h-4 w-4 text-white" />
                                </div>
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Tax (GST)</span>
                                <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                <span className="text-sm text-muted-foreground">Shipping</span>
                                <span className="font-medium">{order.shippingCost === 0 ? <span className="text-emerald-400">Free</span> : formatCurrency(order.shippingCost)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between p-2 rounded-lg bg-emerald-500/20">
                                    <span className="text-sm text-emerald-400">Discount</span>
                                    <span className="font-medium text-emerald-400">-{formatCurrency(order.discountAmount)}</span>
                                </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between p-3 rounded-xl bg-emerald-500/20">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-lg text-emerald-400">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes / Cancellation / Return Reason - Moved here */}
                    {(order.notes || order.cancellationReason || order.returnReason) && (
                        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    Notes & Remarks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {order.notes && (
                                    <div className="p-3 rounded-xl bg-muted/30">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Order Notes</p>
                                        <p className="text-sm leading-relaxed">{order.notes}</p>
                                    </div>
                                )}
                                {order.cancellationReason && (
                                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                                        <p className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            Cancellation Reason
                                        </p>
                                        <p className="text-sm leading-relaxed text-red-300">{order.cancellationReason}</p>
                                    </div>
                                )}
                                {order.returnReason && (
                                    <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                                        <p className="text-xs font-medium text-orange-400 mb-2 flex items-center gap-1">
                                            <RefreshCcw className="h-3 w-3" />
                                            Return Reason
                                        </p>
                                        <p className="text-sm leading-relaxed text-orange-300">{order.returnReason}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timeline - Moved here */}
                    <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500">
                                    <Calendar className="h-4 w-4 text-white" />
                                </div>
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex justify-between p-3 rounded-xl bg-muted/30">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    Created
                                </span>
                                <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-muted/30">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    Updated
                                </span>
                                <span className="text-sm font-medium">{formatDate(order.updatedAt)}</span>
                            </div>
                            {order.cancelledAt && (
                                <div className="flex justify-between p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                                    <span className="text-sm text-red-400 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        Cancelled
                                    </span>
                                    <span className="text-sm font-medium text-red-400">{formatDate(order.cancelledAt)}</span>
                                </div>
                            )}
                            {order.returnRequestedAt && (
                                <div className="flex justify-between p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                                    <span className="text-sm text-orange-400 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                        Return Requested
                                    </span>
                                    <span className="text-sm font-medium text-orange-400">{formatDate(order.returnRequestedAt)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Takes 1 column */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {order.userName && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{order.userName}</span>
                                </div>
                            )}
                            {order.userEmail && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <Link
                                        href={`mailto:${order.userEmail}`}
                                        className="text-primary hover:underline truncate flex-1"
                                    >
                                        {order.userEmail}
                                    </Link>
                                </div>
                            )}
                            {order.userPhone && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
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
                    <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${paymentStatusConfig.bg}`}>
                                    <PaymentIcon className={`h-4 w-4 ${paymentStatusConfig.text}`} />
                                </div>
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge className={`${getPaymentBadgeStyle(order.paymentStatus)} border-0`}>
                                    {getPaymentStatusLabel(order.paymentStatus)}
                                </Badge>
                            </div>
                            {order.paymentMethod && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Method
                                    </span>
                                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                                </div>
                            )}
                            {order.razorpayPaymentId && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        Payment ID
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 px-2 text-xs font-mono rounded-lg hover:bg-primary/10"
                                        onClick={() => copyToClipboard(order.razorpayPaymentId!, "Payment ID")}
                                    >
                                        {order.razorpayPaymentId.slice(0, 12)}...
                                        <Copy className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            )}

                            {/* Refund Button for REFUND_REQUESTED orders */}
                            {order.paymentStatus === "REFUND_REQUESTED" && (
                                <div className="pt-3 border-t border-border">
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

                    {/* Shipping Info */}
                    {(order.trackingNumber || order.carrier) && (
                        <Card className="border border-border bg-card rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                                        <Truck className="h-4 w-4 text-white" />
                                    </div>
                                    Shipping Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                {order.carrier && (
                                    <div className="flex justify-between p-3 rounded-xl bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Carrier</span>
                                        <span className="font-medium">{order.carrier}</span>
                                    </div>
                                )}
                                {order.trackingNumber && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Tracking</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-1 px-2 font-mono text-xs rounded-lg hover:bg-primary/10"
                                            onClick={() => copyToClipboard(order.trackingNumber!, "Tracking number")}
                                        >
                                            {order.trackingNumber}
                                            <Copy className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                {order.estimatedDeliveryDate && (
                                    <div className="flex justify-between p-3 rounded-xl bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Est. Delivery</span>
                                        <span className="font-medium">{formatDate(order.estimatedDeliveryDate)}</span>
                                    </div>
                                )}
                                {order.deliveredAt && (
                                    <div className="flex justify-between p-3 rounded-xl bg-emerald-500/20">
                                        <span className="text-sm text-emerald-400">Delivered</span>
                                        <span className="font-medium text-emerald-400">{formatDate(order.deliveredAt)}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
