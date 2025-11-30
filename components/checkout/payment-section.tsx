import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, Apple } from 'lucide-react';

interface PaymentSectionProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onPayNow: () => void;
  isActive: boolean;
}

export default function PaymentSection({ 
  data, 
  updateData, 
  onPayNow, 
  isActive 
}: PaymentSectionProps) {
  const handlePaymentChange = (field: string, value: string | boolean) => {
    updateData('payment', { [field]: value });
  };

  const handleBillingChange = (field: string, value: string) => {
    updateData('billing', { [field]: value });
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-black">Payment</h2>
      </div>
      
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500">
          All transactions are secure and encrypted.
        </p>
        
        {/* Payment Method Selection */}
        <div className="border border-gray-200 rounded">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="credit-card" 
                  name="payment-method"
                  checked={data.payment?.method === 'credit-card'}
                  onChange={() => handlePaymentChange('method', 'credit-card')}
                  className="w-3 h-3"
                />
                <label htmlFor="credit-card" className="text-sm font-medium">
                  Credit Card
                </label>
              </div>
              <CreditCard className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* Credit Card Form */}
          {data.payment?.method === 'credit-card' && (
            <div className="p-3 space-y-3">
              <Input
                placeholder="1234 1234 1234 1234"
                value={data.payment?.cardNumber || ''}
                onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                className="h-10 text-sm"
              />
              
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="MM/YY"
                  value={data.payment?.expiryDate || ''}
                  onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                  className="h-10 text-sm"
                />
                <Input
                  placeholder="CVV"
                  value={data.payment?.securityCode || ''}
                  onChange={(e) => handlePaymentChange('securityCode', e.target.value)}
                  className="h-10 text-sm"
                />
                <div></div>
              </div>
              
              <Input
                placeholder="Name on card"
                value={data.payment?.nameOnCard || ''}
                onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          )}
        </div>

        {/* Alternative Payment Methods */}
        <div className="space-y-2">
          <Button 
            variant="outline"
            className="w-full h-10 border-gray-300 hover:bg-gray-50 text-sm"
            onClick={() => handlePaymentChange('method', 'paypal')}
          >
            PayPal
          </Button>
          
          <Button 
            className="w-full h-10 bg-black text-white hover:bg-gray-800 text-sm flex items-center justify-center space-x-2"
            onClick={onPayNow}
          >
            <Apple className="w-4 h-4" />
            <span>Apple Pay</span>
          </Button>
        </div>
      </div>

      {/* Billing Address */}
      <div className="px-4 py-3 border-t border-gray-100">
        <h3 className="text-sm font-medium text-black mb-3">Billing Address</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="same-as-shipping" 
              name="billing-address"
              checked={data.payment?.useSameAddress}
              onChange={() => handlePaymentChange('useSameAddress', true)}
              className="w-3 h-3"
            />
            <label htmlFor="same-as-shipping" className="text-xs">
              Same as shipping address
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="different-billing" 
              name="billing-address"
              checked={!data.payment?.useSameAddress}
              onChange={() => handlePaymentChange('useSameAddress', false)}
              className="w-3 h-3"
            />
            <label htmlFor="different-billing" className="text-xs">
              Different billing address
            </label>
          </div>

          {/* Different Billing Address Form */}
          {!data.payment?.useSameAddress && (
            <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded">
              <select 
                value={data.billing?.country || 'United States'}
                onChange={(e) => handleBillingChange('country', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First name"
                  value={data.billing?.firstName || ''}
                  onChange={(e) => handleBillingChange('firstName', e.target.value)}
                  className="h-10 text-sm"
                />
                <Input
                  placeholder="Last name"
                  value={data.billing?.lastName || ''}
                  onChange={(e) => handleBillingChange('lastName', e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              
              <Input
                placeholder="Address"
                value={data.billing?.address || ''}
                onChange={(e) => handleBillingChange('address', e.target.value)}
                className="h-10 text-sm"
              />
              
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="City"
                  value={data.billing?.city || ''}
                  onChange={(e) => handleBillingChange('city', e.target.value)}
                  className="h-10 text-sm"
                />
                <select 
                  value={data.billing?.state || ''}
                  onChange={(e) => handleBillingChange('state', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">State</option>
                  <option value="CA">CA</option>
                  <option value="NY">NY</option>
                  <option value="TX">TX</option>
                </select>
                <Input
                  placeholder="ZIP"
                  value={data.billing?.zipCode || ''}
                  onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complete Order Button */}
      <div className="p-4 border-t border-gray-100">
        <Button 
          onClick={onPayNow}
          className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded font-medium text-sm uppercase tracking-wide"
        >
          Complete Order
        </Button>
      </div>
    </div>
  );
}
