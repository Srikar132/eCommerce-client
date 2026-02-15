"use client";

import { IndianRupee, Package, User } from "lucide-react";
import { PaymentStatus } from "@/types/orders";
import {
    formatCurrency,
    getPaymentStatusConfig,
    getPaymentStatusLabel,
} from "@/lib/utils/order.utils";

// ============================================================================
// TYPES
// ============================================================================

interface OrderQuickStatsProps {
    totalAmount: number;
    itemCount: number;
    paymentStatus: PaymentStatus;
    customerName?: string | null;
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: React.ReactNode;
    valueClassName?: string;
}

function StatCard({ icon, iconBg, label, value, valueClassName }: StatCardProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <p className={valueClassName || "text-lg font-bold"}>{value}</p>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderQuickStats({
    totalAmount,
    itemCount,
    paymentStatus,
    customerName,
}: OrderQuickStatsProps) {
    const paymentConfig = getPaymentStatusConfig(paymentStatus);
    const PaymentIcon = paymentConfig.icon;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={<IndianRupee className="h-5 w-5 text-white" />}
                iconBg="bg-emerald-500"
                label="Total Amount"
                value={formatCurrency(totalAmount)}
                valueClassName="text-lg font-bold text-emerald-400"
            />

            <StatCard
                icon={<Package className="h-5 w-5 text-white" />}
                iconBg="bg-blue-500"
                label="Items"
                value={`${itemCount} ${itemCount === 1 ? "Item" : "Items"}`}
            />

            <StatCard
                icon={<PaymentIcon className={`h-5 w-5 ${paymentConfig.text}`} />}
                iconBg={paymentConfig.bg}
                label="Payment"
                value={getPaymentStatusLabel(paymentStatus)}
                valueClassName={`text-sm font-semibold ${paymentConfig.labelColor}`}
            />

            <StatCard
                icon={<User className="h-5 w-5 text-white" />}
                iconBg="bg-violet-500"
                label="Customer"
                value={
                    <span className="truncate max-w-30">
                        {customerName || "N/A"}
                    </span>
                }
                valueClassName="text-sm font-semibold"
            />
        </div>
    );
}
