'use client';

import { Address } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Home, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (address: Address) => void;
}

export default function AddressCard({ address, isSelected, onSelect }: AddressCardProps) {
  const getAddressIcon = () => {
    switch (address.addressType?.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building2 className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Label
      htmlFor={`address-${address.id}`}
      className="cursor-pointer block"
    >
      <Card
        className={cn(
          'p-4 transition-all duration-200 hover:shadow-md',
          isSelected
            ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
            : 'border-border/50 hover:border-primary/50'
        )}
        onClick={() => onSelect(address)}
      >
        <div className="flex items-start gap-3">
          {/* Radio Button */}
          <RadioGroupItem
            value={address.id}
            id={`address-${address.id}`}
            className="mt-1"
          />

          {/* Address Content */}
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-primary">
                {getAddressIcon()}
                <span className="font-semibold text-foreground capitalize">
                  {address.addressType || 'Address'}
                </span>
              </div>
              {address.isDefault && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  Default
                </Badge>
              )}
            </div>

            {/* Address Details */}
            <div className="text-sm space-y-1">
              <p className="text-foreground font-medium">
                {address.streetAddress}
              </p>
              <p className="text-muted-foreground">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-muted-foreground">
                {address.country}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Label>
  );
}
