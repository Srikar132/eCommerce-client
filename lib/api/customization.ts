import { 
    Customization, 
    CustomizationRequest, 
    SaveCustomizationResponse,
    PagedResponse,
    UUID
} from "@/types";
import { apiClient } from "./client";
import { AxiosResponse } from "axios";

export const customizationApi = {
    /**
     * POST /api/v1/customization/save
     * Saves or updates customization with frontend-generated preview image
     * 
     * Used in: Customizer page - "Save Design" button
     * 
     * Frontend must:
     * 1. Generate preview image using Konva/Canvas
     * 2. Upload to S3/CloudFront
     * 3. Send URL in request along with design details
     * 
     * @param request - Customization data including preview image URL
     */
    saveCustomization: async (request: CustomizationRequest): Promise<SaveCustomizationResponse> => {
        const response: AxiosResponse<SaveCustomizationResponse> = await apiClient.post(
            "/api/v1/customization/save",
            request
        );
        return response.data;
    },

    /**
     * GET /api/v1/customization/{customizationId}
     * Retrieves a specific customization by ID
     * 
     * Used in:
     * - Customizer page - Load saved design
     * - Order page - Display customization being ordered
     * - My Designs page - View design details
     * 
     * @param customizationId - Unique customization identifier
     */
    getCustomizationById: async (customizationId: string): Promise<Customization> => {
        const response: AxiosResponse<Customization> = await apiClient.get(
            `/api/v1/customization/${customizationId}`
        );
        return response.data;
    },

    /**
     * GET /api/v1/customization/product/{productId}
     * Gets all customizations for a specific product by current user
     * 
     * Used in:
     * - Customizer page - "Load Previous Design" dropdown
     * - Product page - Show user's existing designs for this product
     * 
     * @param productId - Product UUID
     */
    getProductCustomizations: async (productId: UUID): Promise<Customization[]> => {
        const response: AxiosResponse<Customization[]> = await apiClient.get(
            `/api/v1/customization/product/${productId}`
        );
        return response.data;
    },

    /**
     * GET /api/v1/customization/my-designs
     * Gets all customizations for the current user (paginated)
     * 
     * Used in: "My Designs" page - Display all user's saved designs
     * 
     * @param page - Page number (0-based, default: 0)
     * @param size - Page size (default: 12)
     */
    getMyDesigns: async (page: number = 0, size: number = 12): Promise<PagedResponse<Customization>> => {
        const response: AxiosResponse<PagedResponse<Customization>> = await apiClient.get(
            "/api/v1/customization/my-designs",
            { params: { page, size } }
        );
        return response.data;
    },

    /**
     * GET /api/v1/customization/guest/product/{productId}
     * Gets guest customizations by session ID
     * 
     * Used in: Customizer page - Load designs for guest users (before login)
     * 
     * @param productId - Product UUID
     * @param sessionId - Guest session identifier
     */
    getGuestCustomizations: async (productId: UUID, sessionId: string): Promise<Customization[]> => {
        const response: AxiosResponse<Customization[]> = await apiClient.get(
            `/api/v1/customization/guest/product/${productId}`,
            { params: { sessionId } }
        );
        return response.data;
    },

    /**
     * DELETE /api/v1/customization/{customizationId}
     * Deletes a customization
     * 
     * Used in: "My Designs" page - Delete design button
     * 
     * @param customizationId - Unique customization identifier
     */
    deleteCustomization: async (customizationId: string): Promise<void> => {
        await apiClient.delete(`/api/v1/customization/${customizationId}`);
    },

    /**
     * POST /api/v1/customization/preview/upload (FAKE API for now)
     * Uploads preview image to S3/CloudFront
     * 
     * TODO: Replace with actual S3 upload implementation
     * 
     * @param blob - Image blob from Konva canvas
     * @returns Preview image URL
     */
    uploadPreviewImage: async (blob: Blob): Promise<{ url: string }> => {
        // FAKE implementation - returns a data URL
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                // In production, this would upload to S3 and return CloudFront URL
                resolve({ url: "https://example.com/preview.png" });
            };
            reader.readAsDataURL(blob);
        });
    },

    /**
     * DELETE /api/v1/customization/preview/{imageUrl} (FAKE API for now)
     * Deletes preview image from S3/CloudFront
     * 
     * TODO: Replace with actual S3 delete implementation
     * 
     * @param imageUrl - URL of image to delete
     */
    deletePreviewImage: async (imageUrl: string): Promise<void> => {
        // FAKE implementation - does nothing
        console.log('Would delete image:', imageUrl);
        return Promise.resolve();
    },
};
