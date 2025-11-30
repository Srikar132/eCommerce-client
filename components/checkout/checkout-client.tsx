'use client';

import { useState } from 'react';
import CheckoutHeader from './checkout-header';
import DeliverySection from './delivery-section';
import PaymentSection from './payment-section';
import OrderSummary from './order-summary';

interface CheckoutData {
  email: string;
  delivery: {
    country: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    method: 'credit-card' | 'paypal';
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    nameOnCard: string;
    useSameAddress: boolean;
  };
  billing: {
    country: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function CheckoutClient() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    email: '',
    delivery: {
      country: 'United States',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
    },
    payment: {
      method: 'credit-card',
      cardNumber: '',
      expiryDate: '',
      securityCode: '',
      nameOnCard: '',
      useSameAddress: true,
    },
    billing: {
      country: 'United States',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const [currentStep, setCurrentStep] = useState<'delivery' | 'payment'>('delivery');

  const updateCheckoutData = (section: string, data: any) => {
    if (section === 'email') {
      setCheckoutData(prev => ({
        ...prev,
        email: data
      }));
    } else {
      setCheckoutData(prev => {
        const currentSection = prev[section as keyof CheckoutData];
        return {
          ...prev,
          [section]: typeof currentSection === 'object' ? { ...currentSection, ...data } : data
        };
      });
    }
  };

  const handlePayNow = async () => {
    // Handle payment processing
    console.log('Processing payment...', checkoutData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <CheckoutHeader />
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4">
            <DeliverySection
              data={checkoutData}
              updateData={updateCheckoutData}
              onNext={() => setCurrentStep('payment')}
              isActive={currentStep === 'delivery'}
            />
            
            <PaymentSection
              data={checkoutData}
              updateData={updateCheckoutData}
              onPayNow={handlePayNow}
              isActive={currentStep === 'payment'}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
