import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

// Mock cart data - in real app this would come from state/context
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: '/home/section2/sec1-col-1.webp',
    size: 'M',
    color: 'Black',
    quantity: 2,
  },
  {
    id: '2',
    name: 'Denim Jacket',
    price: 89.99,
    image: '/home/section2/sec1-col-2.webp',
    size: 'L',
    color: 'Blue',
    quantity: 1,
  },
];

export default function OrderSummary() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-black">Order Summary</h2>
      </div>
      
      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {mockCartItems.map((item) => (
          <div key={item.id} className="flex space-x-3">
            <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-black truncate">
                {item.name}
              </h3>
              <div className="text-xs text-gray-500">
                {item.size && item.color && `${item.size} • ${item.color}`}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs font-medium text-black">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              {item.originalPrice && (
                <div className="text-xs text-gray-400 line-through">
                  ${(item.originalPrice * item.quantity).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Discount Code */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Discount code"
            className="flex-1 h-9 text-sm"
          />
          <Button 
            variant="outline" 
            className="px-4 h-9 text-sm border-gray-300 hover:bg-gray-50"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Order Totals */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-black">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Shipping</span>
          <span className="text-black">Free</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Tax</span>
          <span className="text-black">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-100 pt-2">
          <div className="flex justify-between font-semibold">
            <span className="text-black text-sm">Total</span>
            <span className="text-black text-base">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
