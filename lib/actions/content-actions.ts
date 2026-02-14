"use server";

import { db } from "@/drizzle/db";
import {
    landingCategories,
    showcaseProducts,
    landingTestimonials,
    sliderImages,
} from "@/drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ==================== TYPES ====================

export interface LandingCategory {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    displayOrder: number;
    isActive: boolean;
}

export interface ShowcaseProduct {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    displayOrder: number;
    isActive: boolean;
}

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

export interface SliderImage {
    id: string;
    imageUrl: string;
    altText: string | null;
    displayOrder: number;
    isActive: boolean;
}

// ==================== LANDING CATEGORIES ====================

export async function getLandingCategories(): Promise<LandingCategory[]> {
    try {
        const categories = await db
            .select()
            .from(landingCategories)
            .orderBy(asc(landingCategories.displayOrder));
        return categories;
    } catch (error) {
        console.error("Error fetching landing categories:", error);
        return [];
    }
}

export async function getActiveLandingCategories(): Promise<LandingCategory[]> {
    try {
        const categories = await db
            .select()
            .from(landingCategories)
            .where(eq(landingCategories.isActive, true))
            .orderBy(asc(landingCategories.displayOrder));
        return categories;
    } catch (error) {
        console.error("Error fetching active landing categories:", error);
        return [];
    }
}

export async function createLandingCategory(data: {
    title: string;
    imageUrl: string;
    linkUrl: string;
    displayOrder?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        await db.insert(landingCategories).values({
            title: data.title,
            imageUrl: data.imageUrl,
            linkUrl: data.linkUrl,
            displayOrder: data.displayOrder || 0,
        });
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Category created successfully" };
    } catch (error) {
        console.error("Error creating landing category:", error);
        return { success: false, message: "Failed to create category" };
    }
}

export async function updateLandingCategory(
    id: string,
    data: Partial<{
        title: string;
        imageUrl: string;
        linkUrl: string;
        displayOrder: number;
        isActive: boolean;
    }>
): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .update(landingCategories)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(landingCategories.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Category updated successfully" };
    } catch (error) {
        console.error("Error updating landing category:", error);
        return { success: false, message: "Failed to update category" };
    }
}

export async function deleteLandingCategory(
    id: string
): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(landingCategories).where(eq(landingCategories.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Category deleted successfully" };
    } catch (error) {
        console.error("Error deleting landing category:", error);
        return { success: false, message: "Failed to delete category" };
    }
}

// ==================== SHOWCASE PRODUCTS ====================

export async function getShowcaseProducts(): Promise<ShowcaseProduct[]> {
    try {
        const products = await db
            .select()
            .from(showcaseProducts)
            .orderBy(asc(showcaseProducts.displayOrder));
        return products;
    } catch (error) {
        console.error("Error fetching showcase products:", error);
        return [];
    }
}

export async function getActiveShowcaseProducts(): Promise<ShowcaseProduct[]> {
    try {
        const products = await db
            .select()
            .from(showcaseProducts)
            .where(eq(showcaseProducts.isActive, true))
            .orderBy(asc(showcaseProducts.displayOrder));
        return products;
    } catch (error) {
        console.error("Error fetching active showcase products:", error);
        return [];
    }
}

export async function createShowcaseProduct(data: {
    title: string;
    price: string;
    imageUrl: string;
    displayOrder?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        await db.insert(showcaseProducts).values({
            title: data.title,
            price: data.price,
            imageUrl: data.imageUrl,
            displayOrder: data.displayOrder || 0,
        });
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Showcase product created successfully" };
    } catch (error) {
        console.error("Error creating showcase product:", error);
        return { success: false, message: "Failed to create showcase product" };
    }
}

export async function updateShowcaseProduct(
    id: string,
    data: Partial<{
        title: string;
        price: string;
        imageUrl: string;
        displayOrder: number;
        isActive: boolean;
    }>
): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .update(showcaseProducts)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(showcaseProducts.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Showcase product updated successfully" };
    } catch (error) {
        console.error("Error updating showcase product:", error);
        return { success: false, message: "Failed to update showcase product" };
    }
}

export async function deleteShowcaseProduct(
    id: string
): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(showcaseProducts).where(eq(showcaseProducts.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Showcase product deleted successfully" };
    } catch (error) {
        console.error("Error deleting showcase product:", error);
        return { success: false, message: "Failed to delete showcase product" };
    }
}

// ==================== TESTIMONIALS ====================

export async function getLandingTestimonials(): Promise<LandingTestimonial[]> {
    try {
        const testimonials = await db
            .select()
            .from(landingTestimonials)
            .orderBy(asc(landingTestimonials.displayOrder));
        return testimonials;
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
}

export async function getActiveTestimonials(): Promise<LandingTestimonial[]> {
    try {
        const testimonials = await db
            .select()
            .from(landingTestimonials)
            .where(eq(landingTestimonials.isActive, true))
            .orderBy(asc(landingTestimonials.displayOrder));
        return testimonials;
    } catch (error) {
        console.error("Error fetching active testimonials:", error);
        return [];
    }
}

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
            customerName: data.customerName,
            customerRole: data.customerRole || "Verified Customer",
            reviewText: data.reviewText,
            rating: data.rating || 5,
            isVerifiedPurchase: data.isVerifiedPurchase || false,
            displayOrder: data.displayOrder || 0,
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
        customerName: string;
        customerRole: string;
        reviewText: string;
        rating: number;
        isVerifiedPurchase: boolean;
        displayOrder: number;
        isActive: boolean;
    }>
): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .update(landingTestimonials)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(landingTestimonials.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Testimonial updated successfully" };
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return { success: false, message: "Failed to update testimonial" };
    }
}

export async function deleteTestimonial(
    id: string
): Promise<{ success: boolean; message: string }> {
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

// ==================== SLIDER IMAGES ====================

export async function getSliderImages(): Promise<SliderImage[]> {
    try {
        const images = await db
            .select()
            .from(sliderImages)
            .orderBy(asc(sliderImages.displayOrder));
        return images;
    } catch (error) {
        console.error("Error fetching slider images:", error);
        return [];
    }
}

export async function getActiveSliderImages(): Promise<SliderImage[]> {
    try {
        const images = await db
            .select()
            .from(sliderImages)
            .where(eq(sliderImages.isActive, true))
            .orderBy(asc(sliderImages.displayOrder));
        return images;
    } catch (error) {
        console.error("Error fetching active slider images:", error);
        return [];
    }
}

export async function createSliderImage(data: {
    imageUrl: string;
    altText?: string;
    displayOrder?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        await db.insert(sliderImages).values({
            imageUrl: data.imageUrl,
            altText: data.altText || "Fashion image",
            displayOrder: data.displayOrder || 0,
        });
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Slider image added successfully" };
    } catch (error) {
        console.error("Error creating slider image:", error);
        return { success: false, message: "Failed to add slider image" };
    }
}

export async function updateSliderImage(
    id: string,
    data: Partial<{
        imageUrl: string;
        altText: string;
        displayOrder: number;
        isActive: boolean;
    }>
): Promise<{ success: boolean; message: string }> {
    try {
        await db
            .update(sliderImages)
            .set(data)
            .where(eq(sliderImages.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Slider image updated successfully" };
    } catch (error) {
        console.error("Error updating slider image:", error);
        return { success: false, message: "Failed to update slider image" };
    }
}

export async function deleteSliderImage(
    id: string
): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(sliderImages).where(eq(sliderImages.id, id));
        revalidatePath("/");
        revalidatePath("/admin/content");
        return { success: true, message: "Slider image deleted successfully" };
    } catch (error) {
        console.error("Error deleting slider image:", error);
        return { success: false, message: "Failed to delete slider image" };
    }
}
