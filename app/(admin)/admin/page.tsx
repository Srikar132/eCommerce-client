import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    TrendingDown,
    Package,
    ShoppingCart,
    Users,
    IndianRupee,
    ArrowRight,
    BarChart3,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
    Star,
    AlertTriangle,
    PackageX,
    RefreshCcw,
    Truck
} from "lucide-react";
import Link from "next/link";
import { getAdminDashboardStats, getRecentOrders, getLowStockProducts, getOrderStatusCounts } from "@/lib/actions/admin-actions";
import { formatRelativeTime } from "@/lib/utils";

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease" | "neutral";
    icon: React.ReactNode;
    iconBg: string;
}

function StatsCard({ title, value, change, changeType, icon, iconBg }: StatsCardProps) {
    return (
        <Card className="border-0 bg-card shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {changeType === "increase" ? (
                                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0 gap-1 px-2 py-0.5">
                                    <TrendingUp className="h-3 w-3" />
                                    {change}
                                </Badge>
                            ) : changeType === "decrease" ? (
                                <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-0 gap-1 px-2 py-0.5">
                                    <TrendingDown className="h-3 w-3" />
                                    {change}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="gap-1 px-2 py-0.5">
                                    {change}
                                </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">vs last week</span>
                        </div>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Quick Action Card Component
interface QuickActionProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    iconBg: string;
}

function QuickActionCard({ title, description, href, icon, iconBg }: QuickActionProps) {
    return (
        <Link href={href}>
            <Card className="border-0 bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group rounded-xl overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                    <div className="flex-1 space-y-0.5">
                        <h4 className="font-semibold text-sm">{title}</h4>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
            </Card>
        </Link>
    );
}

// Recent Order Row Component
interface RecentOrderProps {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
}

function RecentOrderRow({ id, orderNumber, customerName, totalAmount, status, createdAt }: RecentOrderProps) {
    const statusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle2; label: string }> = {
        DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: CheckCircle2, label: "Delivered" },
        PROCESSING: { bg: "bg-blue-500/10", text: "text-blue-500", icon: Clock, label: "Processing" },
        CONFIRMED: { bg: "bg-blue-500/10", text: "text-blue-500", icon: CheckCircle2, label: "Confirmed" },
        SHIPPED: { bg: "bg-violet-500/10", text: "text-violet-500", icon: Truck, label: "Shipped" },
        PENDING: { bg: "bg-amber-500/10", text: "text-amber-500", icon: AlertCircle, label: "Pending" },
        CANCELLED: { bg: "bg-rose-500/10", text: "text-rose-500", icon: XCircle, label: "Cancelled" },
        RETURN_REQUESTED: { bg: "bg-orange-500/10", text: "text-orange-500", icon: RefreshCcw, label: "Return Requested" },
        RETURNED: { bg: "bg-gray-500/10", text: "text-gray-500", icon: PackageX, label: "Returned" },
        REFUNDED: { bg: "bg-violet-500/10", text: "text-violet-500", icon: RefreshCcw, label: "Refunded" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const StatusIcon = config.icon;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Link href={`/admin/orders/${id}`}>
            <div className="flex items-center justify-between py-4 border-b border-border/40 last:border-0 hover:bg-muted/5 px-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${config.text}`} />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{customerName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(createdAt)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

// Low Stock Alert Component
interface LowStockAlertProps {
    name: string;
    sku: string;
    totalStock: number;
    productId: string;
}

function LowStockAlert({ name, sku, totalStock, productId }: LowStockAlertProps) {
    return (
        <Link href={`/admin/products/${productId}`}>
            <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 hover:bg-muted/5 px-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        <p className="font-medium text-sm truncate max-w-[150px]">{name}</p>
                        <p className="text-xs text-muted-foreground">{sku}</p>
                    </div>
                </div>
                <Badge variant="outline" className={`${totalStock === 0 ? 'border-rose-500 text-rose-500' : 'border-amber-500 text-amber-500'}`}>
                    {totalStock === 0 ? 'Out of Stock' : `${totalStock} left`}
                </Badge>
            </div>
        </Link>
    );
}

export default async function AdminDashboard() {
    const session = await auth();
    const userName = session?.user?.name?.split(' ')[0] || 'Admin';

    // Fetch real data
    const [statsResult, ordersResult, lowStockResult, orderStatusResult] = await Promise.all([
        getAdminDashboardStats(),
        getRecentOrders(5),
        getLowStockProducts(10),
        getOrderStatusCounts(),
    ]);

    const stats = statsResult.data;
    const recentOrders = ordersResult.data || [];
    const lowStockProducts = lowStockResult.data || [];
    const orderStatusCounts = orderStatusResult.data || {};

    // Calculate pending actions
    const pendingOrdersCount = (orderStatusCounts.PENDING || 0) + (orderStatusCounts.CONFIRMED || 0);
    const returnRequestsCount = orderStatusCounts.RETURN_REQUESTED || 0;

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Hey {userName} <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s what&apos;s happening with your store today.
                    </p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl px-6">
                    <Link href="/admin/products/create">
                        <Package className="h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={stats ? formatCurrency(stats.totalRevenue) : "₹0"}
                    change={stats ? `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%` : "0%"}
                    changeType={stats && stats.revenueChange > 0 ? "increase" : stats && stats.revenueChange < 0 ? "decrease" : "neutral"}
                    icon={<IndianRupee className="h-6 w-6 text-emerald-600" />}
                    iconBg="bg-emerald-500/20"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats ? formatNumber(stats.totalOrders) : "0"}
                    change={stats ? `${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%` : "0%"}
                    changeType={stats && stats.ordersChange > 0 ? "increase" : stats && stats.ordersChange < 0 ? "decrease" : "neutral"}
                    icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
                    iconBg="bg-blue-500/20"
                />
                <StatsCard
                    title="Products"
                    value={stats ? stats.totalProducts.toString() : "0"}
                    change={stats ? `+${stats.productsChange} new` : "+0 new"}
                    changeType={stats && stats.productsChange > 0 ? "increase" : "neutral"}
                    icon={<Package className="h-6 w-6 text-violet-500" />}
                    iconBg="bg-violet-500/20"
                />
                <StatsCard
                    title="Customers"
                    value={stats ? formatNumber(stats.totalCustomers) : "0"}
                    change={stats ? `+${stats.customersChange} new` : "+0 new"}
                    changeType={stats && stats.customersChange > 0 ? "increase" : "neutral"}
                    icon={<Users className="h-6 w-6 text-amber-500" />}
                    iconBg="bg-amber-500/20"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders - Takes 2 columns */}
                <Card className="lg:col-span-2 border-0 bg-card shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                        <div>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                Recent Orders
                            </CardTitle>
                            <CardDescription>Latest orders from your store</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="gap-1 text-primary hover:text-primary/80">
                            <Link href="/admin/orders">
                                View All
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <RecentOrderRow key={order.id} {...order} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No orders yet</p>
                                <p className="text-sm text-muted-foreground/70">Orders will appear here once placed</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions Sidebar */}
                <div className="space-y-4">
                    <Card className="border-0 bg-card shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader className="pb-3 border-b border-border/40">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-500" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <QuickActionCard
                                title="Manage Products"
                                description="View and edit your products"
                                href="/admin/products"
                                icon={<Package className="h-5 w-5 text-violet-500" />}
                                iconBg="bg-violet-500/10"
                            />
                            <QuickActionCard
                                title="View Orders"
                                description={pendingOrdersCount > 0 ? `${pendingOrdersCount} pending` : "Track and manage orders"}
                                href="/admin/orders"
                                icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
                                iconBg="bg-blue-500/10"
                            />
                            <QuickActionCard
                                title="Manage Users"
                                description="View customer accounts"
                                href="/admin/users"
                                icon={<Users className="h-5 w-5 text-emerald-500" />}
                                iconBg="bg-emerald-500/10"
                            />
                            <QuickActionCard
                                title="Store Settings"
                                description="Configure your store"
                                href="/admin/settings"
                                icon={<BarChart3 className="h-5 w-5 text-amber-500" />}
                                iconBg="bg-amber-500/10"
                            />
                        </CardContent>
                    </Card>

                    {/* Low Stock Alert Card */}
                    {lowStockProducts.length > 0 && (
                        <Card className="border-0 bg-card shadow-lg rounded-2xl overflow-hidden border-l-4 border-l-amber-500">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    Low Stock Alert
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-3">
                                {lowStockProducts.slice(0, 3).map((product) => (
                                    <LowStockAlert
                                        key={product.id}
                                        productId={product.id}
                                        name={product.name}
                                        sku={product.sku}
                                        totalStock={product.totalStock}
                                    />
                                ))}
                                {lowStockProducts.length > 3 && (
                                    <Link href="/admin/products?stock=low" className="block text-center mt-3">
                                        <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                                            View all {lowStockProducts.length} low stock items
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Store Status Card */}
                    <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-medium">Store Online</span>
                            </div>
                            <h4 className="font-semibold text-lg mb-1">Everything&apos;s running smoothly</h4>
                            <p className="text-sm text-muted-foreground">
                                {pendingOrdersCount > 0
                                    ? `${pendingOrdersCount} orders need attention`
                                    : "All systems operational"
                                }
                                {returnRequestsCount > 0 && ` • ${returnRequestsCount} return requests`}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
