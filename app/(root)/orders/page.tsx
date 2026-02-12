import { getUserOrders } from "@/lib/actions/order-actions";
import OrderCard from "@/components/cards/order-card";
import LoadMoreButton from "@/components/order/load-more-button";
import { Package } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "0");
    const size = 10;

    const { data: orders, totalPages, totalElements } = await getUserOrders(page, size);

    const hasMore = page + 1 < totalPages;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Your Orders</h1>
                <p className="text-muted-foreground">
                    {totalElements > 0
                        ? `${totalElements} ${totalElements === 1 ? 'order' : 'orders'} found`
                        : 'No orders yet'
                    }
                </p>
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                        <LoadMoreButton currentPage={page} />
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Orders Yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Start shopping to see your orders here
                    </p>
                    <Link
                        href="/products"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            )}
        </div>
    );
}