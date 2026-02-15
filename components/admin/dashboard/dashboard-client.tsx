"use client";

import {
    StatsCards,
    ActionItems,
    RecentOrders,
    OrderPipeline,
    InventoryAlerts,
} from "@/components/admin/dashboard";

export function DashboardClient() {
    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <StatsCards />

            {/* Order Pipeline Overview */}
            <OrderPipeline />

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Left Column - Recent Orders (takes 3 columns) */}
                <div className="lg:col-span-3">
                    <RecentOrders />
                </div>

                {/* Right Column - Action Items & Inventory */}
                <div className="lg:col-span-2 space-y-6">
                    <ActionItems />
                    <InventoryAlerts />
                </div>
            </div>
        </div>
    );
}
