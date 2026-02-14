"use server";

import { db } from "@/drizzle/db";
import { orders, products, productVariants, users, categories } from "@/drizzle/schema";
import { eq, sql, desc, and, count } from "drizzle-orm";
import { auth } from "@/auth";

// ============================================================================
// ADMIN DASHBOARD STATISTICS
// ============================================================================

export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    totalProducts: number;
    productsChange: number;
    totalCustomers: number;
    customersChange: number;
}

export interface RecentOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
}

export interface LowStockProduct {
    id: string;
    name: string;
    sku: string;
    totalStock: number;
    variantsCount: number;
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<{
    success: boolean;
    data?: DashboardStats;
    error?: string;
}> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        // Get date ranges
        const now = new Date();
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - 7);

        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);

        // Total Revenue (all time) and this week
        const [revenueResult] = await db
            .select({
                total: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'PAID' THEN ${orders.totalAmount}::numeric ELSE 0 END), 0)`,
                thisWeek: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'PAID' AND ${orders.createdAt} >= ${thisWeekStart} THEN ${orders.totalAmount}::numeric ELSE 0 END), 0)`,
                lastWeek: sql<string>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'PAID' AND ${orders.createdAt} >= ${lastWeekStart} AND ${orders.createdAt} < ${thisWeekStart} THEN ${orders.totalAmount}::numeric ELSE 0 END), 0)`,
            })
            .from(orders);

        const totalRevenue = parseFloat(revenueResult.total || "0");
        const thisWeekRevenue = parseFloat(revenueResult.thisWeek || "0");
        const lastWeekRevenue = parseFloat(revenueResult.lastWeek || "0");
        const revenueChange = lastWeekRevenue > 0
            ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
            : thisWeekRevenue > 0 ? 100 : 0;

        // Total Orders
        const [ordersResult] = await db
            .select({
                total: count(),
                thisWeek: sql<number>`COUNT(CASE WHEN ${orders.createdAt} >= ${thisWeekStart} THEN 1 END)`,
                lastWeek: sql<number>`COUNT(CASE WHEN ${orders.createdAt} >= ${lastWeekStart} AND ${orders.createdAt} < ${thisWeekStart} THEN 1 END)`,
            })
            .from(orders);

        const totalOrders = ordersResult.total;
        const thisWeekOrders = Number(ordersResult.thisWeek) || 0;
        const lastWeekOrders = Number(ordersResult.lastWeek) || 0;
        const ordersChange = lastWeekOrders > 0
            ? ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100
            : thisWeekOrders > 0 ? 100 : 0;

        // Total Products
        const [productsResult] = await db
            .select({
                total: count(),
                thisWeek: sql<number>`COUNT(CASE WHEN ${products.createdAt} >= ${thisWeekStart} THEN 1 END)`,
            })
            .from(products)
            .where(eq(products.isActive, true));

        const totalProducts = productsResult.total;
        const productsChange = Number(productsResult.thisWeek) || 0;

        // Total Customers
        const [customersResult] = await db
            .select({
                total: count(),
                thisWeek: sql<number>`COUNT(CASE WHEN ${users.createdAt} >= ${thisWeekStart} THEN 1 END)`,
            })
            .from(users)
            .where(eq(users.role, "USER"));

        const totalCustomers = customersResult.total;
        const customersChange = Number(customersResult.thisWeek) || 0;

        return {
            success: true,
            data: {
                totalRevenue,
                revenueChange: Math.round(revenueChange * 10) / 10,
                totalOrders,
                ordersChange: Math.round(ordersChange * 10) / 10,
                totalProducts,
                productsChange,
                totalCustomers,
                customersChange,
            },
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, error: "Failed to fetch dashboard statistics" };
    }
}

/**
 * Get recent orders for admin dashboard
 */
export async function getRecentOrders(limit: number = 5): Promise<{
    success: boolean;
    data?: RecentOrder[];
    error?: string;
}> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const recentOrders = await db
            .select({
                id: orders.id,
                orderNumber: orders.orderNumber,
                customerName: users.name,
                totalAmount: orders.totalAmount,
                status: orders.status,
                paymentStatus: orders.paymentStatus,
                createdAt: orders.createdAt,
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .orderBy(desc(orders.createdAt))
            .limit(limit);

        return {
            success: true,
            data: recentOrders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.customerName || "Guest",
                totalAmount: parseFloat(order.totalAmount as string),
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            })),
        };
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        return { success: false, error: "Failed to fetch recent orders" };
    }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(threshold: number = 10): Promise<{
    success: boolean;
    data?: LowStockProduct[];
    error?: string;
}> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const lowStockProducts = await db
            .select({
                id: products.id,
                name: products.name,
                sku: products.sku,
                totalStock: sql<number>`COALESCE(SUM(${productVariants.stockQuantity}), 0)::int`,
                variantsCount: sql<number>`COUNT(${productVariants.id})::int`,
            })
            .from(products)
            .leftJoin(productVariants, eq(productVariants.productId, products.id))
            .where(eq(products.isActive, true))
            .groupBy(products.id, products.name, products.sku)
            .having(sql`COALESCE(SUM(${productVariants.stockQuantity}), 0) <= ${threshold}`)
            .orderBy(sql`COALESCE(SUM(${productVariants.stockQuantity}), 0)`)
            .limit(5);

        return {
            success: true,
            data: lowStockProducts.map((p) => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                totalStock: Number(p.totalStock),
                variantsCount: Number(p.variantsCount),
            })),
        };
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        return { success: false, error: "Failed to fetch low stock products" };
    }
}

/**
 * Get order status counts for dashboard
 */
export async function getOrderStatusCounts(): Promise<{
    success: boolean;
    data?: Record<string, number>;
    error?: string;
}> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const statusCounts = await db
            .select({
                status: orders.status,
                count: count(),
            })
            .from(orders)
            .groupBy(orders.status);

        const result: Record<string, number> = {};
        statusCounts.forEach((item) => {
            result[item.status] = item.count;
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error fetching order status counts:", error);
        return { success: false, error: "Failed to fetch order status counts" };
    }
}

/**
 * Get payment status counts
 */
export async function getPaymentStatusCounts(): Promise<{
    success: boolean;
    data?: Record<string, number>;
    error?: string;
}> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const statusCounts = await db
            .select({
                paymentStatus: orders.paymentStatus,
                count: count(),
            })
            .from(orders)
            .groupBy(orders.paymentStatus);

        const result: Record<string, number> = {};
        statusCounts.forEach((item) => {
            result[item.paymentStatus] = item.count;
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error fetching payment status counts:", error);
        return { success: false, error: "Failed to fetch payment status counts" };
    }
}

/**
 * Get category stats
 */
export async function getCategoryStats(): Promise<{
    success: boolean;
    data?: { id: string; name: string; productCount: number }[];
    error?: string;
}> {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const categoryStats = await db
            .select({
                id: categories.id,
                name: categories.name,
                productCount: sql<number>`COUNT(${products.id})::int`,
            })
            .from(categories)
            .leftJoin(products, and(
                eq(products.categoryId, categories.id),
                eq(products.isActive, true)
            ))
            .where(eq(categories.isActive, true))
            .groupBy(categories.id, categories.name)
            .orderBy(sql`COUNT(${products.id}) DESC`);

        return {
            success: true,
            data: categoryStats.map((c) => ({
                id: c.id,
                name: c.name,
                productCount: Number(c.productCount),
            })),
        };
    } catch (error) {
        console.error("Error fetching category stats:", error);
        return { success: false, error: "Failed to fetch category statistics" };
    }
}
