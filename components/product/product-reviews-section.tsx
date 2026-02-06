import ProductReviewsClient from "./product-reviews-client";

interface ProductReviewsSectionProps {
    productId: string;
    averageRating?: number;
    reviewCount?: number;
}

export default function ProductReviewsSection({ 
    productId, 
}: ProductReviewsSectionProps) {
    // Removed server-side prefetching to avoid Neon HTTP connection timeout issues
    // Reviews will be fetched on the client-side with proper error handling
    return <ProductReviewsClient productId={productId} />;
}
