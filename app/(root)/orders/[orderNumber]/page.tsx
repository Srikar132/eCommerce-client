

import { getOrderDetails } from "@/lib/actions/order-actions";
import { notFound } from "next/navigation";
import OrderTrackingClient from "@/components/order/order-tracking-client";

export default async function OrderPage({
    params
}: {
    params: Promise<{ orderNumber: string }>;
}) {
    const { orderNumber } = await params;

    const order = await getOrderDetails(orderNumber).catch(() => null);

    if (!order) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <OrderTrackingClient order={order} />
        </div>
    );
}