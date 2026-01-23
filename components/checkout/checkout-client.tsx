'use client';

import CheckoutHeader from './checkout-header';
import OrderSummary from './order-summary';
import AddressSelection from './address-selection';
import PaymentSection from './payment-section';
import useCheckout from '@/hooks/use-checkout';


export default function CheckoutClient() {



  const {
    selectedShippingAddress,
    setSelectedShippingAddress,
    addresses,
    loadingAddresses,
    addressesError,
    handleCheckout,
    isProcessing,
    error,
    isCheckingOut,
    isVerifyingPayment
  } = useCheckout();



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <CheckoutHeader />
        
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mt-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <AddressSelection
              addresses={addresses}
              selectedAddress={selectedShippingAddress}
              onSelectAddress={setSelectedShippingAddress}
              isLoading={loadingAddresses}
              isError={addressesError}
            />

            {/* Payment Section */}
            <PaymentSection
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
              isCheckingOut={isCheckingOut}
              isVerifyingPayment={isVerifyingPayment}
              error={error}
              disabled={!selectedShippingAddress || loadingAddresses}
            />
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
