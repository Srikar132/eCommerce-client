import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DeliverySectionProps {
  data: any;
  updateData: (section: string, data: any) => void;
  onNext: () => void;
  isActive: boolean;
}

export default function DeliverySection({ 
  data, 
  updateData, 
  onNext, 
  isActive 
}: DeliverySectionProps) {
  const handleInputChange = (field: string, value: string) => {
    updateData('delivery', { [field]: value });
  };

  const handleEmailChange = (value: string) => {
    updateData('email', value);
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-black">Contact Information</h2>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={data.email || ''}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="w-full h-10 text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="newsletter" 
            className="rounded border-gray-300 text-black focus:ring-black w-3 h-3"
          />
          <label htmlFor="newsletter" className="text-xs text-gray-600">
            Subscribe to newsletter
          </label>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <h2 className="text-base font-medium text-black mb-3">Shipping Address</h2>
        
        <div className="p-4 space-y-3">
          <select 
            value={data.delivery?.country || 'United States'}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              value={data.delivery?.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="h-10 text-sm"
            />
            <Input
              placeholder="Last name"
              value={data.delivery?.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="h-10 text-sm"
            />
          </div>

          <Input
            placeholder="Street address"
            value={data.delivery?.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="h-10 text-sm"
          />

          <Input
            placeholder="Apartment, suite, etc. (optional)"
            value={data.delivery?.apartment || ''}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
            className="h-10 text-sm"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              placeholder="City"
              value={data.delivery?.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="h-10 text-sm"
            />
            <select 
              value={data.delivery?.state || ''}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="">State</option>
              <option value="CA">CA</option>
              <option value="NY">NY</option>
              <option value="TX">TX</option>
            </select>
            <Input
              placeholder="ZIP"
              value={data.delivery?.zipCode || ''}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="h-10 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Standard Shipping</span>
            <span className="text-sm text-gray-600">Free</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">5-7 business days</p>
        </div>
      </div>
    </div>
  );
}
