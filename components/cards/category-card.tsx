import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export interface CategoryCardProps {
  id?: string | number;
  title: string;
  image: string;
  url: string;
  className?: string;
}

export default function CategoryCard({
  title,
  image,
  url,
  className
}: CategoryCardProps) {
  return (
    <Link
      href={url}
      className={`block group ${className}`}
    >
      <Card className="relative w-full h-[400px] sm:h-[450px] lg:h-[430px] overflow-hidden rounded-2xl border-2 border-border hover:border-primary shadow-md hover:shadow-2xl transition-all duration-500 bg-card group-hover:-translate-y-2">

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={`${title} category`}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content Container */}
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 lg:p-6">

          {/* Decorative Line */}
          <div className="w-12 h-0.5 sm:w-16 sm:h-1 bg-primary mb-3 sm:mb-4 transform origin-left group-hover:w-20 transition-all duration-500" />

          {/* Category Title */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider text-white uppercase mb-2 sm:mb-3 transform group-hover:translate-x-2 transition-transform duration-500">
            {title}
          </h3>

          {/* Shop Now Button */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-white/90 group-hover:text-white text-xs sm:text-sm font-medium uppercase tracking-widest transition-colors duration-300">
            <span>Explore</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>

          {/* Decorative Corner Element */}
          <div className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-r-2 border-white/30 group-hover:border-primary/60 transition-colors duration-500" />

        </div>

        {/* Animated Border Effect */}
        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500" />

      </Card>
    </Link>
  );
}