"use server";


import { db } from "@/drizzle/db";
import {
    categories,
    heroSlides,
    landingTestimonials,
} from "@/drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";

// ==================== TYPES ====================

export interface LandingTestimonial {
    id: string;
    customerName: string;
    customerRole: string | null;
    reviewText: string;
    rating: number;
    isVerifiedPurchase: boolean;
    displayOrder: number;
    isActive: boolean;
}

export interface HeroSlide {
    id: string;
    imageUrl: string;
    altText: string;
    eyebrow: string;
    heading: string;
    textColor: string;
    buttonLabel: string;
    displayOrder: number;
    isActive: boolean;
}

// ==================== TESTIMONIALS ====================

export const getLandingTestimonials = unstable_cache(
    async (): Promise<LandingTestimonial[]> => {
        try {
            return await db.select().from(landingTestimonials).orderBy(asc(landingTestimonials.displayOrder));
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            return [];
        }
    },
    ["landing-testimonials"],
    { revalidate: 60 * 60 * 24 * 7, tags: ["testimonials"] }
);

export const getActiveTestimonials = unstable_cache(
    async (): Promise<LandingTestimonial[]> => {
        try {
            return await db
                .select()
                .from(landingTestimonials)
                .where(eq(landingTestimonials.isActive, true))
                .orderBy(asc(landingTestimonials.displayOrder));
        } catch (error) {
            console.error("Error fetching active testimonials:", error);
            return [];
        }
    },
    ["active-testimonials"],
    { revalidate: 60 * 60 * 24 * 7, tags: ["testimonials"] }
);


export async function createTestimonial(data: {
    customerName: string;
    customerRole?: string;
    reviewText: string;
    rating?: number;
    isVerifiedPurchase?: boolean;
    displayOrder?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        await db.insert(landingTestimonials).values({
            customerName: data.customerName, customerRole: data.customerRole || "Verified Customer",
            reviewText: data.reviewText, rating: data.rating || 5,
            isVerifiedPurchase: data.isVerifiedPurchase || false, displayOrder: data.displayOrder || 0,
        });
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Testimonial created successfully" };
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return { success: false, message: "Failed to create testimonial" };
    }
}

export async function updateTestimonial(
    id: string,
    data: Partial<{
        customerName: string; customerRole: string; reviewText: string;
        rating: number; isVerifiedPurchase: boolean; displayOrder: number; isActive: boolean;
    }>
): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(landingTestimonials).set({ ...data, updatedAt: new Date() }).where(eq(landingTestimonials.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Testimonial updated successfully" };
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return { success: false, message: "Failed to update testimonial" };
    }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(landingTestimonials).where(eq(landingTestimonials.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Testimonial deleted successfully" };
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return { success: false, message: "Failed to delete testimonial" };
    }
}

// ==================== HERO SLIDES ====================

export const getHeroSlides = unstable_cache(
    async (): Promise<HeroSlide[]> => {
        try {
            const slides = await db
                .select()
                .from(heroSlides)
                .orderBy(asc(heroSlides.displayOrder));
            return slides as HeroSlide[];
        } catch (error) {
            console.error("Error fetching hero slides:", error);
            return [];
        }
    },
    ["hero-slides"],
    { revalidate: 60 * 60 * 24 * 7, tags: ["hero-slides"] }
);

export const getActiveHeroSlides = unstable_cache(
    async (): Promise<HeroSlide[]> => {
        try {
            const slides = await db
                .select()
                .from(heroSlides)
                .where(eq(heroSlides.isActive, true))
                .orderBy(asc(heroSlides.displayOrder));
            return slides as HeroSlide[];
        } catch (error) {
            console.error("Error fetching active hero slides:", error);
            return [];
        }
    },
    ["active-hero-slides"],
    { revalidate: 60 * 60 * 24 * 7, tags: ["hero-slides"] }
);

export async function createHeroSlide(data: {
    imageUrl: string;
    altText: string;
    eyebrow: string;
    heading: string;
    textColor: string;
    buttonLabel: string;
    displayOrder?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        await db.insert(heroSlides).values({
            imageUrl: data.imageUrl,
            altText: data.altText,
            eyebrow: data.eyebrow,
            heading: data.heading,
            textColor: data.textColor,
            buttonLabel: data.buttonLabel,
            displayOrder: data.displayOrder || 0,
        });
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Hero slide created successfully" };
    } catch (error) {
        console.error("Error creating hero slide:", error);
        return { success: false, message: "Failed to create hero slide" };
    }
}

export async function updateHeroSlide(
    id: string,
    data: Partial<{
        imageUrl: string;
        altText: string;
        eyebrow: string;
        heading: string;
        textColor: string;
        buttonLabel: string;
        displayOrder: number;
        isActive: boolean;
    }>
): Promise<{ success: boolean; message: string }> {
    try {
        // Image cleanup
        if (data.imageUrl) {
            const [existing] = await db
                .select({ imageUrl: heroSlides.imageUrl })
                .from(heroSlides)
                .where(eq(heroSlides.id, id))
                .limit(1);

            if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
                const { extractPublicId, deleteImage } = await import("@/lib/cloudinary");
                const publicId = extractPublicId(existing.imageUrl);
                if (publicId) {
                    deleteImage(publicId).catch(err =>
                        console.error("Cloudinary hero image delete failed:", err)
                    );
                }
            }
        }

        await db
            .update(heroSlides)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(heroSlides.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Hero slide updated successfully" };
    } catch (error) {
        console.error("Error updating hero slide:", error);
        return { success: false, message: "Failed to update hero slide" };
    }
}

export async function deleteHeroSlide(
    id: string
): Promise<{ success: boolean; message: string }> {
    try {
        const [existing] = await db
            .select({ imageUrl: heroSlides.imageUrl })
            .from(heroSlides)
            .where(eq(heroSlides.id, id))
            .limit(1);

        if (existing?.imageUrl) {
            const { extractPublicId, deleteImage } = await import("@/lib/cloudinary");
            const publicId = extractPublicId(existing.imageUrl);
            if (publicId) {
                deleteImage(publicId).catch(err =>
                    console.error("Cloudinary hero image delete failed:", err)
                );
            }
        }

        await db.delete(heroSlides).where(eq(heroSlides.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Hero slide deleted successfully" };
    } catch (error) {
        console.error("Error deleting hero slide:", error);
        return { success: false, message: "Failed to delete hero slide" };
    }
}


// =======================================
// Ctaory Managemtnt
// ======================================
export const getActiveCategories = unstable_cache(
    async () => {
        try {
            const results = await db
                .select()
                .from(categories)
                .where(eq(categories.isActive, true))
                .orderBy(asc(categories.displayOrder), asc(categories.name));
            return results;
        } catch (error) {
            console.error("Error fetching active categories:", error);
            return [];
        }
    },
    ["active-categories"],
    { revalidate: 60 * 60 * 24 * 7, tags: ["categories"] }
);

export async function updateCategory(
    id: string,
    data: Partial<{
        name: string;
        slug: string;
        description: string;
        imageUrl: string;
        isActive: boolean;
        displayOrder: number;
    }>
) {
    try {
        if (data.imageUrl) {
            const [existing] = await db
                .select({ imageUrl: categories.imageUrl })
                .from(categories)
                .where(eq(categories.id, id))
                .limit(1);

            if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
                const { extractPublicId, deleteImage } = await import("@/lib/cloudinary");
                const publicId = extractPublicId(existing.imageUrl);
                if (publicId) {
                    deleteImage(publicId).catch((err) =>
                        console.error("Cloudinary category image delete failed:", err)
                    );
                }
            }
        }

        await db.update(categories).set(data).where(eq(categories.id, id));

        revalidatePath("/admin/products");
        revalidatePath("/");
        return { success: true, message: "Category updated successfully" };
    } catch (error) {
        console.error("Error updating category:", error);
        return { success: false, message: "Failed to update category" };
    }
}