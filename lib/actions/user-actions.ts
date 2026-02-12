"use server";

import { db } from "@/drizzle/db";
import { users, orders, orderItems } from "@/drizzle/schema";
import { PagedResponse } from "@/types";
import { UserParams, UserWithStats } from "@/types/auth";
import { and, count, desc, asc, or, ilike, eq, sql } from "drizzle-orm";

/**
 * Get all users with pagination, filtering, and stats
 */
export async function getAllUsers(params: UserParams = {}): Promise<PagedResponse<UserWithStats>> {
    const {
        searchQuery,
        role,
        page = 0,
        limit = 20,
        sortBy = "CREATED_AT_DESC"
    } = params;

    try {
        // Build where conditions
        const conditions = [];

        // Role filter
        if (role) {
            conditions.push(eq(users.role, role));
        }

        // Search filter (email, phone, name)
        if (searchQuery) {
            conditions.push(
                or(
                    ilike(users.email, `%${searchQuery}%`),
                    ilike(users.phone, `%${searchQuery}%`),
                    ilike(users.name, `%${searchQuery}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Build order by clause
        let orderBy;
        switch (sortBy) {
            case "NAME_ASC":
                orderBy = asc(users.name);
                break;
            case "NAME_DESC":
                orderBy = desc(users.name);
                break;
            case "EMAIL_ASC":
                orderBy = asc(users.email);
                break;
            case "EMAIL_DESC":
                orderBy = desc(users.email);
                break;
            case "ROLE_ASC":
                orderBy = asc(users.role);
                break;
            case "ROLE_DESC":
                orderBy = desc(users.role);
                break;
            case "PRODUCTS_ASC":
                orderBy = sql`total_products ASC`;
                break;
            case "PRODUCTS_DESC":
                orderBy = sql`total_products DESC`;
                break;
            case "CREATED_AT_ASC":
                orderBy = asc(users.createdAt);
                break;
            case "CREATED_AT_DESC":
            default:
                orderBy = desc(users.createdAt);
                break;
        }

        // Get users with product count
        const usersWithStats = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                emailVerified: users.emailVerified,
                phone: users.phone,
                phoneVerified: users.phoneVerified,
                role: users.role,
                acceptTerms: users.acceptTerms,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
                totalProducts: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`.as('total_products'),
            })
            .from(users)
            .leftJoin(orders, eq(users.id, orders.userId))
            .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
            .where(whereClause)
            .groupBy(
                users.id,
                users.name,
                users.email,
                users.emailVerified,
                users.phone,
                users.phoneVerified,
                users.role,
                users.acceptTerms,
                users.createdAt,
                users.updatedAt
            )
            .orderBy(orderBy)
            .limit(limit)
            .offset(page * limit);

        // Get total count
        const [{ totalCount }] = await db
            .select({
                totalCount: count(),
            })
            .from(users)
            .where(whereClause);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: usersWithStats.map(user => ({
                ...user,
                email: user.email || undefined,
                name: user.name || undefined,
                emailVerified: !!user.emailVerified,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                totalProducts: Number(user.totalProducts),
            })),
            page,
            size: limit,
            totalPages,
            totalElements: totalCount,
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<void> {
    try {
        await db
            .delete(users)
            .where(eq(users.id, userId));
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: 'ADMIN' | 'USER'): Promise<void> {
    try {
        await db
            .update(users)
            .set({ role: newRole, updatedAt: new Date() })
            .where(eq(users.id, userId));
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
}