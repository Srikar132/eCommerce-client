"use client";

import { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types/orders";

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
import { DeliveryDetails } from "@/components/admin/order/delivery-details";

interface OrderDetailsClientProps {
    order: Order & { 
        userName?: string | null; 
        userEmail?: string | null; 
        userPhone?: string | null; 
    };
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
                customerName={order.userName || "Customer"}
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

                    <DeliveryDetails
                        status={currentStatus}
                        trackingNumber={order.trackingNumber}
                        carrier={order.carrier}
                        estimatedDeliveryDate={order.estimatedDeliveryDate}
                        deliveredAt={order.deliveredAt}
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

