



import CheckoutClient from "@/components/checkout/checkout-client";

export const metadata = {
  title: 'Checkout - THE NALA ARMOIRE',
  description: 'Complete your purchase securely with our streamlined checkout process.',
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <CheckoutClient />
    </main>
  );
}