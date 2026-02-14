"use server";

import { db } from "@/drizzle/db";
import { storeSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface StoreSettingsData {
    id: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    updatedAt: Date;
}

// Default settings if none exist
const DEFAULT_SETTINGS: Omit<StoreSettingsData, "updatedAt"> = {
    id: "default",
    email: "support@armoire.com",
    phone: "+91 9876543210",
    address: "123, Fashion Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
};

// Get store settings (creates default if not exists)
export async function getStoreSettings(): Promise<StoreSettingsData> {
    try {
        const [settings] = await db
            .select()
            .from(storeSettings)
            .where(eq(storeSettings.id, "default"))
            .limit(1);

        if (!settings) {
            // Create default settings if none exist
            const [newSettings] = await db
                .insert(storeSettings)
                .values({
                    id: "default",
                    email: DEFAULT_SETTINGS.email,
                    phone: DEFAULT_SETTINGS.phone,
                    address: DEFAULT_SETTINGS.address,
                    city: DEFAULT_SETTINGS.city,
                    state: DEFAULT_SETTINGS.state,
                    pincode: DEFAULT_SETTINGS.pincode,
                    country: DEFAULT_SETTINGS.country,
                })
                .returning();

            return newSettings;
        }

        return settings;
    } catch (error) {
        console.error("Error fetching store settings:", error);
        // Return defaults if DB error
        return {
            ...DEFAULT_SETTINGS,
            updatedAt: new Date(),
        };
    }
}

// Update store settings
export async function updateStoreSettings(data: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
}): Promise<{ success: boolean; message: string; data?: StoreSettingsData }> {
    try {
        // Check if settings exist
        const [existing] = await db
            .select()
            .from(storeSettings)
            .where(eq(storeSettings.id, "default"))
            .limit(1);

        let updatedSettings: StoreSettingsData;

        if (!existing) {
            // Create with provided data
            const [newSettings] = await db
                .insert(storeSettings)
                .values({
                    id: "default",
                    email: data.email || DEFAULT_SETTINGS.email,
                    phone: data.phone || DEFAULT_SETTINGS.phone,
                    address: data.address || DEFAULT_SETTINGS.address,
                    city: data.city || DEFAULT_SETTINGS.city,
                    state: data.state || DEFAULT_SETTINGS.state,
                    pincode: data.pincode || DEFAULT_SETTINGS.pincode,
                    country: data.country || DEFAULT_SETTINGS.country,
                })
                .returning();

            updatedSettings = newSettings;
        } else {
            // Update existing
            const [updated] = await db
                .update(storeSettings)
                .set({
                    ...data,
                    updatedAt: new Date(),
                })
                .where(eq(storeSettings.id, "default"))
                .returning();

            updatedSettings = updated;
        }

        // Revalidate pages that use store settings
        revalidatePath("/");
        revalidatePath("/contact");
        revalidatePath("/admin/settings");

        return {
            success: true,
            message: "Settings updated successfully",
            data: updatedSettings,
        };
    } catch (error) {
        console.error("Error updating store settings:", error);
        return {
            success: false,
            message: "Failed to update settings",
        };
    }
}
