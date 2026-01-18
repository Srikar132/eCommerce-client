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
     * GET /api/v1/customization/{id}
     * Retrieves a specific customization by ID
     * 
     * Used in:
     * - Customizer page - Load saved design
     * - Order page - Display customization being ordered
     * - My Designs page - View design details
     * 
     * @param id - Unique customization identifier
     */
    getCustomizationById: async (id: string): Promise<Customization> => {
        const response: AxiosResponse<Customization> = await apiClient.get(
            `/api/v1/customization/${id}`
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
     * DELETE /api/v1/customization/{id}
     * Deletes a customization
     * 
     * Used in: "My Designs" page - Delete design button
     * 
     * @param id - Unique customization identifier
     */
    deleteCustomization: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/customization/${id}`);
    },

    /**
     * POST /api/v1/customization/upload-preview
     * Uploads customization preview image to S3
     * 
     * Used in: Customizer page - Before saving design
     * 
     * Frontend workflow:
     * 1. User clicks "Save Design"
     * 2. Generate preview image using Konva.toDataURL()
     * 3. Convert to File/Blob
     * 4. Upload using this endpoint → Get preview URL
     * 5. Send preview URL + design data to /save endpoint
     * 
     * @param file - Image file from Konva canvas
     * @returns Preview image URL (CDN or S3)
     */
    uploadPreviewImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post<{
            id: string;
            fileName: string;
            s3Url: string;
            cdnUrl: string | null;
            fileSize: number;
            dimensions: string;
        }>("/api/v1/customization/upload-preview", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Return CDN URL if available, otherwise S3 URL
        return response.data.cdnUrl || response.data.s3Url;
    },
};
