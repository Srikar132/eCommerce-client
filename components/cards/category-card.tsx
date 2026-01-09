import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export interface CategoryCardProps {
  id: number;
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
      <Card className="relative w-full h-[400px] sm:h-[450px] overflow-hidden rounded-2xl border-2 border-border hover:border-primary shadow-md hover:shadow-2xl transition-all duration-500 bg-card group-hover:-translate-y-2">
        
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
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
          
          {/* Decorative Line */}
          <div className="w-16 h-1 bg-primary mb-4 transform origin-left group-hover:w-24 transition-all duration-500" />

          {/* Category Title */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white uppercase mb-3 transform group-hover:translate-x-2 transition-transform duration-500">
            {title}
          </h3>

          {/* Shop Now Button */}
          <div className="inline-flex items-center gap-2 text-white/90 group-hover:text-white text-sm sm:text-base font-medium uppercase tracking-widest transition-colors duration-300">
            <span>Explore Collection</span>
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
          <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white/30 group-hover:border-primary/60 transition-colors duration-500" />
          
        </div>

        {/* Animated Border Effect */}
        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500" />

      </Card>
    </Link>
  );
}