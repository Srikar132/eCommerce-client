import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export interface PremiumProductCardProps {
  image: string;
  title: string;
  subtitle?: string;
  price?: number;
  currency?: string;
  imageAlt?: string;
  className?: string;
}

export default function HomePremiumProductCard({
  image,
  title,
  subtitle = "& more",
  price,
  currency = "$",
  imageAlt = "Product image",
  className
}: PremiumProductCardProps) {
  return (
    <Card className={`w-full min-w-70 overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group ${className}`}>
      {/* Compact Image Container */}
      <div className="relative h-48 overflow-hidden rounded-3xl m-2 shadow-2xl ">
        
          <Image
            src={image}
            alt={imageAlt}
            fill
            className=" drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 280px) 100vw, 280px"
          />
        
      </div>

      <CardContent className="p-4 text-center space-y-2">
        {/* Product Title - Compact */}
        <h3 className="text-sm font-medium tracking-wide text-stone-700 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-0.5 py-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-rose-400 text-xs">★</span>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}