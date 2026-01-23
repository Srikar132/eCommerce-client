import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CheckoutHeader() {
  return (
    <div className="mb-8 pb-6 border-b border-border/30">
      <div className="flex items-center justify-between mb-4">
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Cart</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Secure Checkout</span>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          THE NALA ARMOIRE
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Complete Your Order</p>
      </div>
    </div>
  );
}
