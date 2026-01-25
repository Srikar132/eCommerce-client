import { CustomizationLoadingSkeleton } from "./customization-skeleton";
import ProductPreviewSkeleton from "./product-preview-skeleton";

// Page loading skeleton
export default function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      loading
    </div>
  );
}
