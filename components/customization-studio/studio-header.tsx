import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StudioHeaderProps {
  productSlug: string;
  productName: string;
  variantId: string;
}

export default function StudioHeader({ productSlug, productName, variantId }: StudioHeaderProps) {
  return (
    <header className="border-b border-slate-200/60 dark:border-slate-800/80 dark:bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={`/customization/${productSlug}?variantId=${variantId}`}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
        <div className="hidden md:block italic font-display text-lg text-slate-600 dark:text-slate-400">
          {productName}
        </div>
        <div className="w-20" />
      </div>
    </header>
  );
}
