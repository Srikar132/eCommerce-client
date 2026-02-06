
import { Suspense } from 'react';
// import CheckoutClient from '@/components/checkout/checkout-client';
import { CheckoutSkeleton } from '@/components/ui/skeletons';


export const metadata = {
  title: 'Checkout - THE NALA ARMOIRE',
  description: 'Complete your purchase securely with our streamlined checkout process.',
};

export default function CheckoutPage() {




  return (
    <main className="min-h-screen bg-background">
      <div className="relative">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-muted/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative">
          <Suspense fallback={<CheckoutSkeleton />}>
            {/* <CheckoutClient /> */}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
