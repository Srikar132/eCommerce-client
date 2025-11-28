
import React from 'react';
import Image from 'next/image';

export interface BestsellerCardProps {
  imageUrl: string;
  brand: string;
  name: string;
  price: number;
  colors?: string[];
}

const BestsellerCard: React.FC<BestsellerCardProps> = ({
  imageUrl,
  brand,
  name,
  price,
  colors = ['#000000']
}) => {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm  transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative bg-gray-50 aspect-[3/4] sm:aspect-[2.5/4] md:aspect-[2.7/4] overflow-hidden group">
        <Image
          src={imageUrl}
          alt={name}
          height={400}
          width={300}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-2 sm:p-3 md:p-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-1">
          {brand}
        </p>

        <h3 className="text-sm sm:text-base md:text-lg font-normal text-gray-900 mb-2 sm:mb-3 line-clamp-2">
          {name}
        </h3>

        <p className="text-base sm:text-lg md:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
          ${price.toFixed(2)}
        </p>

        <div className="flex justify-center gap-1 sm:gap-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border border-gray-300 hover:border-gray-900 transition-colors duration-200"
              style={{ backgroundColor: color }}
              aria-label={`Color option ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestsellerCard;