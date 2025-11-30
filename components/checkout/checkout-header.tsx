import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutHeader() {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Cart
        </Link>
        <h1 className="text-lg font-semibold text-black uppercase tracking-wide">
          THE NALA ARMOIRE
        </h1>
        <div className="w-12"></div> {/* Spacer for center alignment */}
      </div>
    </div>
  );
}
