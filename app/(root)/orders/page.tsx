import { getUserOrders } from "@/lib/actions/order-actions";
import OrderCard from "@/components/cards/order-card";
import LoadMoreButton from "@/components/order/load-more-button";
import { Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";

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
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto mb-8">
                <BreadcrumbNavigation />
            </div>
            {/* Orders List */}
            {orders.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12 md:mb-16 text-left">
                        <h1 className="h1 mb-3">Your Orders</h1>
                        <p className="p-base text-muted-foreground">
                            {totalElements > 0
                                ? `Showing ${orders.length} of ${totalElements} orders you&apos;ve placed.`
                                : 'No orders yet'
                            }
                        </p>
                    </div>
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="pt-8 flex justify-center">
                                <LoadMoreButton currentPage={page} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto py-20 px-6">
                    <div className="bg-muted/30 rounded-[3rem] p-12 md:p-20 text-center flex flex-col items-center shadow-sm border border-muted-foreground/5">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md mb-8">
                            <Package className="w-12 h-12 text-accent" />
                        </div>
                        <h2 className="h2 mb-4">No Orders Yet</h2>
                        <p className="p-base text-muted-foreground mb-10 max-w-sm">
                            Looks like you haven&apos;t placed any orders yet. Start your journey with our premium collection.
                        </p>
                        <Button
                            asChild
                            className="rounded-full px-10 py-7 h-auto text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            <Link href="/products">
                                Browse Products
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
