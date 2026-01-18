import { Suspense } from 'react';
import CheckoutClient from '@/components/checkout/checkout-client';
import { CheckoutPageSkeleton } from '@/components/ui/skeletons';

export const metadata = {
  title: 'Checkout - THE NALA ARMOIRE',
  description: 'Complete your purchase securely with our streamlined checkout process.',
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<CheckoutPageSkeleton />}>
        <CheckoutClient />
      </Suspense>
    </main>
  );
}
