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
      className={`block group flex flex-col gap-2 ${className}`}
    >
      <div className="relative rounded-3xl w-full h-100 sm:h-112.5 lg:h-107.5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={`${title} category`}
            fill
            draggable={false}
            className="object-cover select-none transition-all duration-700 group-hover:scale-105 "
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
      <span className='font-semibold text-xl hover:underline text-center'>{title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()}</span>
    </Link>
  );
}