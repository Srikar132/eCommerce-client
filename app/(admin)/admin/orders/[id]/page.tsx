import { notFound } from "next/navigation";
import { getOrderByIdAdmin } from "@/lib/actions/order-actions";
import { OrderDetailsClient } from "./order-details-client";

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = await params;
    const result = await getOrderByIdAdmin(id);

    if (!result.success || !result.data) {
        notFound();
    }

    return <OrderDetailsClient order={result.data} />;
}
