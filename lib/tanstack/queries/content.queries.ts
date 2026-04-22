// ============================================================================
// CONTENT MANAGEMENT QUERY HOOKS (Admin)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
    getLandingTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    type LandingTestimonial,
    type HeroSlide,
} from "@/lib/actions/content-actions";

// ============================================================================
// TESTIMONIALS
// ============================================================================

/**
 * Fetch all testimonials
 */
export const useTestimonials = () => {
    return useQuery({
        queryKey: queryKeys.content.testimonials(),
        queryFn: getLandingTestimonials,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Create a new testimonial
 */
export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            customerName: string;
            customerRole?: string;
            reviewText: string;
            rating?: number;
            isVerifiedPurchase?: boolean;
            displayOrder?: number;
        }) => createTestimonial(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.testimonials() });
        },
    });
};

/**
 * Update a testimonial
 */
export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: Partial<{
                customerName: string;
                customerRole: string;
                reviewText: string;
                rating: number;
                isVerifiedPurchase: boolean;
                displayOrder: number;
                isActive: boolean;
            }>;
        }) => updateTestimonial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.testimonials() });
        },
    });
};

/**
 * Delete a testimonial
 */
export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTestimonial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.testimonials() });
        },
    });
};

// ============================================================================
// HERO SLIDES
// ============================================================================

/**
 * Fetch all hero slides
 */
export const useHeroSlides = () => {
    return useQuery({
        queryKey: queryKeys.content.hero(),
        queryFn: getHeroSlides,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Create a new hero slide
 */
export const useCreateHeroSlide = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            imageUrl: string;
            altText: string;
            eyebrow: string;
            heading: string;
            textColor: string;
            buttonLabel: string;
            displayOrder?: number;
        }) => createHeroSlide(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.hero() });
        },
    });
};

/**
 * Update a hero slide
 */
export const useUpdateHeroSlide = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: Partial<{
                imageUrl: string;
                altText: string;
                eyebrow: string;
                heading: string;
                textColor: string;
                buttonLabel: string;
                displayOrder: number;
                isActive: boolean;
            }>;
        }) => updateHeroSlide(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.hero() });
        },
    });
};

/**
 * Delete a hero slide
 */
export const useDeleteHeroSlide = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteHeroSlide(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.hero() });
        },
    });
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
    LandingTestimonial,
    HeroSlide,
};
