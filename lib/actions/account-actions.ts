'use server';

import { db } from '@/drizzle/db';
import { users, orders, addresses, carts, cartItems } from '@/drizzle/schema';
import { eq, count, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

/**
 * Update user account details (name and email)
 */
export async function updateAccountDetails(data: {
    name?: string;
    email?: string;
}) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to update your account.',
            };
        }

        // Validate input
        if (!data.name && !data.email) {
            return {
                success: false,
                error: 'Please provide at least one field to update.',
            };
        }

        // Validate email format if provided
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return {
                    success: false,
                    error: 'Please provide a valid email address.',
                };
            }

            // Check if email already exists for another user
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, data.email))
                .limit(1);

            if (existingUser.length > 0 && existingUser[0].id !== session.user.id) {
                return {
                    success: false,
                    error: 'This email is already registered to another account.',
                };
            }
        }

        // Validate name if provided
        if (data.name && data.name.trim().length < 2) {
            return {
                success: false,
                error: 'Name must be at least 2 characters long.',
            };
        }

        // Prepare update data
        const updateData: { name?: string; email?: string; emailVerified?: Date | null; updatedAt: Date } = {
            updatedAt: new Date(),
        };

        if (data.name) {
            updateData.name = data.name.trim();
        }

        if (data.email) {
            updateData.email = data.email.toLowerCase().trim();
            // Reset email verification if email changed
            updateData.emailVerified = null;
        }

        // Update user
        const [updatedUser] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id))
            .returning();

        if (!updatedUser) {
            return {
                success: false,
                error: 'Failed to update account. Please try again.',
            };
        }

        // Revalidate paths
        revalidatePath('/account');
        revalidatePath('/account/settings');

        return {
            success: true,
            message: 'Account details updated successfully.',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                emailVerified: updatedUser.emailVerified,
            },
        };
    } catch (error) {
        console.error('Error updating account details:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Get current user account details
 */
export async function getAccountDetails() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in.',
            };
        }

        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                emailVerified: users.emailVerified,
                phone: users.phone,
                phoneVerified: users.phoneVerified,
                role: users.role,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        if (!user) {
            return {
                success: false,
                error: 'User not found.',
            };
        }

        return {
            success: true,
            user,
        };
    } catch (error) {
        console.error('Error fetching account details:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Get user statistics (orders, wishlist, addresses, cart)
 */
export async function getUserStats() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in.',
            };
        }

        // Fetch all stats in parallel
        const [
            orderCountResult,
            addressCountResult,
            activeCartResult,
        ] = await Promise.all([
            // Count total orders
            db
                .select({ count: count() })
                .from(orders)
                .where(eq(orders.userId, session.user.id)),
            
            // Count addresses
            db
                .select({ count: count() })
                .from(addresses)
                .where(eq(addresses.userId, session.user.id)),
            
            // Get active cart with item count
            db
                .select({
                    cartId: carts.id,
                    itemCount: sql<number>`cast(count(${cartItems.id}) as int)`,
                })
                .from(carts)
                .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
                .where(
                    sql`${carts.userId} = ${session.user.id} AND ${carts.isActive} = true`
                )
                .groupBy(carts.id)
                .limit(1),
        ]);

        // TODO: Implement wishlist count when wishlist table is added to schema
        // For now, we'll return 0 as placeholder
        const wishlistCount = 0;

        const stats = {
            totalOrders: orderCountResult[0]?.count || 0,
            wishlistItems: wishlistCount,
            savedAddresses: addressCountResult[0]?.count || 0,
            cartItems: activeCartResult[0]?.itemCount || 0,
        };

        return {
            success: true,
            stats,
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
            stats: {
                totalOrders: 0,
                wishlistItems: 0,
                savedAddresses: 0,
                cartItems: 0,
            },
        };
    }
}
