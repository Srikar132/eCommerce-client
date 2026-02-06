'use server';

import { db } from '@/drizzle/db';
import { addresses } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export type AddressType = 'HOME' | 'OFFICE' | 'OTHER';

interface AddAddressInput {
    addressType?: AddressType;
    streetAddress?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault?: boolean;
}

/**
 * Add a new address for the user
 */
export async function addAddress(data: AddAddressInput) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to add an address.',
            };
        }

        // Validate required fields
        if (!data.city || !data.state || !data.country || !data.postalCode) {
            return {
                success: false,
                error: 'Please provide all required address fields.',
            };
        }

        // Validate postal code format (basic validation)
        if (data.postalCode.trim().length < 3) {
            return {
                success: false,
                error: 'Please provide a valid postal code.',
            };
        }

        // If this is set as default, unset other default addresses
        if (data.isDefault) {
            await db
                .update(addresses)
                .set({ isDefault: false })
                .where(eq(addresses.userId, session.user.id));
        }

        // Check if user has no addresses, make this one default
        const userAddresses = await db
            .select()
            .from(addresses)
            .where(eq(addresses.userId, session.user.id));

        const shouldBeDefault = data.isDefault || userAddresses.length === 0;

        // Create new address
        const [newAddress] = await db
            .insert(addresses)
            .values({
                userId: session.user.id,
                addressType: data.addressType || 'HOME',
                streetAddress: data.streetAddress?.trim() || null,
                city: data.city.trim(),
                state: data.state.trim(),
                country: data.country.trim(),
                postalCode: data.postalCode.trim(),
                isDefault: shouldBeDefault,
            })
            .returning();

        if (!newAddress) {
            return {
                success: false,
                error: 'Failed to add address. Please try again.',
            };
        }

        // Revalidate paths
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        revalidatePath('/checkout');

        return {
            success: true,
            message: 'Address added successfully.',
            address: newAddress,
        };
    } catch (error) {
        console.error('Error adding address:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Update an existing address
 */
export async function updateAddress(addressId: string, data: AddAddressInput) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to update an address.',
            };
        }

        // Verify address belongs to user
        const [existingAddress] = await db
            .select()
            .from(addresses)
            .where(
                and(
                    eq(addresses.id, addressId),
                    eq(addresses.userId, session.user.id)
                )
            )
            .limit(1);

        if (!existingAddress) {
            return {
                success: false,
                error: 'Address not found or you do not have permission to update it.',
            };
        }

        // Validate required fields
        if (!data.city || !data.state || !data.country || !data.postalCode) {
            return {
                success: false,
                error: 'Please provide all required address fields.',
            };
        }

        // If this is set as default, unset other default addresses
        if (data.isDefault) {
            await db
                .update(addresses)
                .set({ isDefault: false })
                .where(eq(addresses.userId, session.user.id));
        }

        // Update address
        const [updatedAddress] = await db
            .update(addresses)
            .set({
                addressType: data.addressType || existingAddress.addressType,
                streetAddress: data.streetAddress?.trim() || existingAddress.streetAddress,
                city: data.city.trim(),
                state: data.state.trim(),
                country: data.country.trim(),
                postalCode: data.postalCode.trim(),
                isDefault: data.isDefault ?? existingAddress.isDefault,
            })
            .where(eq(addresses.id, addressId))
            .returning();

        if (!updatedAddress) {
            return {
                success: false,
                error: 'Failed to update address. Please try again.',
            };
        }

        // Revalidate paths
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        revalidatePath('/checkout');

        return {
            success: true,
            message: 'Address updated successfully.',
            address: updatedAddress,
        };
    } catch (error) {
        console.error('Error updating address:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to delete an address.',
            };
        }

        // Verify address belongs to user
        const [existingAddress] = await db
            .select()
            .from(addresses)
            .where(
                and(
                    eq(addresses.id, addressId),
                    eq(addresses.userId, session.user.id)
                )
            )
            .limit(1);

        if (!existingAddress) {
            return {
                success: false,
                error: 'Address not found or you do not have permission to delete it.',
            };
        }

        // Delete address
        await db
            .delete(addresses)
            .where(eq(addresses.id, addressId));

        // If deleted address was default, set another address as default
        if (existingAddress.isDefault) {
            const [firstAddress] = await db
                .select()
                .from(addresses)
                .where(eq(addresses.userId, session.user.id))
                .limit(1);

            if (firstAddress) {
                await db
                    .update(addresses)
                    .set({ isDefault: true })
                    .where(eq(addresses.id, firstAddress.id));
            }
        }

        // Revalidate paths
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        revalidatePath('/checkout');

        return {
            success: true,
            message: 'Address deleted successfully.',
        };
    } catch (error) {
        console.error('Error deleting address:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(addressId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to set default address.',
            };
        }

        // Verify address belongs to user
        const [existingAddress] = await db
            .select()
            .from(addresses)
            .where(
                and(
                    eq(addresses.id, addressId),
                    eq(addresses.userId, session.user.id)
                )
            )
            .limit(1);

        if (!existingAddress) {
            return {
                success: false,
                error: 'Address not found or you do not have permission to modify it.',
            };
        }

        // Unset all default addresses for user
        await db
            .update(addresses)
            .set({ isDefault: false })
            .where(eq(addresses.userId, session.user.id));

        // Set this address as default
        const [updatedAddress] = await db
            .update(addresses)
            .set({ isDefault: true })
            .where(eq(addresses.id, addressId))
            .returning();

        if (!updatedAddress) {
            return {
                success: false,
                error: 'Failed to set default address. Please try again.',
            };
        }

        // Revalidate paths
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        revalidatePath('/checkout');

        return {
            success: true,
            message: 'Default address updated successfully.',
            address: updatedAddress,
        };
    } catch (error) {
        console.error('Error setting default address:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Get all addresses for the current user
 */
export async function getUserAddresses() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to view addresses.',
            };
        }

        const userAddresses = await db
            .select()
            .from(addresses)
            .where(eq(addresses.userId, session.user.id))
            .orderBy(addresses.isDefault, addresses.createdAt);

        return {
            success: true,
            addresses: userAddresses,
        };
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}

/**
 * Get a specific address by ID
 */
export async function getAddressById(addressId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Unauthorized. Please log in to view address.',
            };
        }

        const [address] = await db
            .select()
            .from(addresses)
            .where(
                and(
                    eq(addresses.id, addressId),
                    eq(addresses.userId, session.user.id)
                )
            )
            .limit(1);

        if (!address) {
            return {
                success: false,
                error: 'Address not found.',
            };
        }

        return {
            success: true,
            address,
        };
    } catch (error) {
        console.error('Error fetching address:', error);
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
        };
    }
}
