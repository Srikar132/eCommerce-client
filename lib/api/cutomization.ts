import { apiClient } from "./client";

/**
 * Upload customization preview image to S3
 * Call this BEFORE saving customization
 * Returns the S3/CDN URL to use in save request
 */
export const uploadCustomizationPreview = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{
    id: string;
    fileName: string;
    s3Url: string;
    cdnUrl: string | null;
    fileSize: number;
    dimensions: string;
  }>("/customization/upload-preview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Return CDN URL if available, otherwise S3 URL
  return response.data.cdnUrl || response.data.s3Url;
};

/**
 * Save customization with preview URL
 * Call this AFTER uploading preview image
 */
export const saveCustomization = async (data: {
  productId: string;
  variantId: string;
  designData: string;
  previewImageUrl: string;
  designName?: string;
}) => {
  const response = await apiClient.post("/customization/save", data);
  return response.data;
};

/**
 * Get customization by ID
 */
export const getCustomization = async (customizationId: string) => {
  const response = await apiClient.get(`/customization/${customizationId}`);
  return response.data;
};

/**
 * Get all customizations for a product
 */
export const getProductCustomizations = async (productId: string) => {
  const response = await apiClient.get(`/customization/product/${productId}`);
  return response.data;
};

/**
 * Get user's saved designs (paginated)
 */
export const getMyDesigns = async (page = 0, size = 12) => {
  const response = await apiClient.get("/customization/my-designs", {
    params: { page, size },
  });
  return response.data;
};

/**
 * Get guest customizations by session ID
 */
export const getGuestCustomizations = async (
  productId: string,
  sessionId: string
) => {
  const response = await apiClient.get(
    `/customization/guest/product/${productId}`,
    {
      params: { sessionId },
    }
  );
  return response.data;
};

/**
 * Delete customization
 */
export const deleteCustomization = async (customizationId: string) => {
  const response = await apiClient.delete(`/customization/${customizationId}`);
  return response.data;
};
