"use client";

import { useState } from "react";
import { OrderStatus, PaymentStatus } from "@/types/orders";

// Modular Components
import { OrderHeader } from "@/components/admin/order/order-header";
import { OrderQuickStats } from "@/components/admin/order/order-quick-stats";
import { OrderStatusCard } from "@/components/admin/order/order-status-card";
import { OrderItemsList } from "@/components/admin/order/order-items-list";
import { OrderAddresses } from "@/components/admin/order/order-addresses";
import { OrderSummary } from "@/components/admin/order/order-summary";
import { OrderNotes } from "@/components/admin/order/order-notes";
import { OrderTimeline } from "@/components/admin/order/order-timeline";
import { CustomerDetails } from "@/components/admin/order/customer-details";
import { PaymentDetails } from "@/components/admin/order/payment-details";

// ============================================================================
// TYPES
// ============================================================================

interface Address {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

interface OrderItem {
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
}

interface Order {
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
    shippingAddress?: Address | null;
    billingAddress?: Address | null;
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
    items: OrderItem[];
    userName?: string | null;
    userEmail?: string | null;
    userPhone?: string | null;
}

interface OrderDetailsClientProps {
    order: Order;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderDetailsClient({ order }: OrderDetailsClientProps) {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status as OrderStatus);

    return (
        <div className="space-y-6">
            {/* Header with Navigation */}
            <OrderHeader
                orderNumber={order.orderNumber}
                status={currentStatus}
                createdAt={order.createdAt}
            />

            {/* Quick Stats */}
            <OrderQuickStats
                totalAmount={order.totalAmount}
                itemCount={order.items.length}
                paymentStatus={order.paymentStatus as PaymentStatus}
                customerName={order.userName}
            />

            {/* Status Progress & Update */}
            <OrderStatusCard
                orderId={order.id}
                currentStatus={currentStatus}
                onStatusUpdate={setCurrentStatus}
            />

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <OrderItemsList items={order.items} />

                    <OrderAddresses
                        shippingAddress={order.shippingAddress}
                        billingAddress={order.billingAddress}
                    />

                    <OrderSummary
                        subtotal={order.subtotal}
                        taxAmount={order.taxAmount}
                        shippingCost={order.shippingCost}
                        discountAmount={order.discountAmount}
                        totalAmount={order.totalAmount}
                    />

                    <OrderNotes
                        notes={order.notes}
                        cancellationReason={order.cancellationReason}
                        returnReason={order.returnReason}
                    />

                    <OrderTimeline
                        createdAt={order.createdAt}
                        updatedAt={order.updatedAt}
                        cancelledAt={order.cancelledAt}
                        returnRequestedAt={order.returnRequestedAt}
                    />
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    <CustomerDetails
                        userName={order.userName}
                        userEmail={order.userEmail}
                        userPhone={order.userPhone}
                    />

                    <PaymentDetails
                        orderId={order.id}
                        orderNumber={order.orderNumber}
                        totalAmount={order.totalAmount}
                        paymentStatus={order.paymentStatus as PaymentStatus}
                        paymentMethod={order.paymentMethod as "card" | "upi" | "netbanking" | null | undefined}
                        razorpayPaymentId={order.razorpayPaymentId}
                    />
                </div>
            </div>
        </div>
    );
}
