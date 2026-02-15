// ============================================================================
// CONTENT MANAGEMENT QUERY HOOKS (Admin)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
    getLandingCategories,
    createLandingCategory,
    updateLandingCategory,
    deleteLandingCategory,
    getShowcaseProducts,
    createShowcaseProduct,
    updateShowcaseProduct,
    deleteShowcaseProduct,
    getLandingTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getSliderImages,
    createSliderImage,
    updateSliderImage,
    deleteSliderImage,
    type LandingCategory,
    type ShowcaseProduct,
    type LandingTestimonial,
    type SliderImage,
} from "@/lib/actions/content-actions";

// ============================================================================
// LANDING CATEGORIES
// ============================================================================

/**
 * Fetch all landing categories
 */
export const useLandingCategories = () => {
    return useQuery({
        queryKey: queryKeys.content.categories(),
        queryFn: getLandingCategories,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Create a new landing category
 */
export const useCreateLandingCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            title: string;
            imageUrl: string;
            linkUrl: string;
            displayOrder?: number;
        }) => createLandingCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.categories() });
        },
    });
};

/**
 * Update a landing category
 */
export const useUpdateLandingCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: Partial<{
                title: string;
                imageUrl: string;
                linkUrl: string;
                displayOrder: number;
                isActive: boolean;
            }>;
        }) => updateLandingCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.categories() });
        },
    });
};

/**
 * Delete a landing category
 */
export const useDeleteLandingCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteLandingCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.categories() });
        },
    });
};

// ============================================================================
// SHOWCASE PRODUCTS
// ============================================================================

/**
 * Fetch all showcase products
 */
export const useShowcaseProducts = () => {
    return useQuery({
        queryKey: queryKeys.content.showcase(),
        queryFn: getShowcaseProducts,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Create a new showcase product
 */
export const useCreateShowcaseProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            title: string;
            price: string;
            imageUrl: string;
            displayOrder?: number;
        }) => createShowcaseProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.showcase() });
        },
    });
};

/**
 * Update a showcase product
 */
export const useUpdateShowcaseProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: Partial<{
                title: string;
                price: string;
                imageUrl: string;
                displayOrder: number;
                isActive: boolean;
            }>;
        }) => updateShowcaseProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.showcase() });
        },
    });
};

/**
 * Delete a showcase product
 */
export const useDeleteShowcaseProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteShowcaseProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.showcase() });
        },
    });
};

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
// SLIDER IMAGES
// ============================================================================

/**
 * Fetch all slider images
 */
export const useSliderImages = () => {
    return useQuery({
        queryKey: queryKeys.content.slider(),
        queryFn: getSliderImages,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Create a new slider image
 */
export const useCreateSliderImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            imageUrl: string;
            altText?: string;
            displayOrder?: number;
        }) => createSliderImage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.slider() });
        },
    });
};

/**
 * Update a slider image
 */
export const useUpdateSliderImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: Partial<{
                imageUrl: string;
                altText: string;
                displayOrder: number;
                isActive: boolean;
            }>;
        }) => updateSliderImage(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.slider() });
        },
    });
};

/**
 * Delete a slider image
 */
export const useDeleteSliderImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSliderImage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.content.slider() });
        },
    });
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
    LandingCategory,
    ShowcaseProduct,
    LandingTestimonial,
    SliderImage,
};
