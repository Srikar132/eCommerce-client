'use client';

import { Address } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MapPin, ArrowLeft } from 'lucide-react';
import AddressCard from './address-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { InlineAddressForm } from './inline-address-form';

interface AddressSelectionProps {
  addresses?: Address[];
  selectedAddress?: Address;
  onSelectAddress: (address: Address) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export default function AddressSelection({
  addresses,
  selectedAddress,
  onSelectAddress,
  isLoading,
  isError,
}: AddressSelectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Auto-select default address on mount or when addresses change
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        onSelectAddress(defaultAddress);
      } else {
        // If no default, select the first address
        onSelectAddress(addresses[0]);
      }
    }
  }, [addresses, selectedAddress, onSelectAddress]);

  // Auto-show form if no addresses exist
  useEffect(() => {
    if (!isLoading && addresses && addresses.length === 0) {
      setShowAddForm(true);
    }
  }, [isLoading, addresses]);

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Shipping Address
          </CardTitle>
          <CardDescription>
            Select or add a delivery address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load addresses. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show inline form when no addresses or user clicks add
  if ((!addresses || addresses.length === 0) && showAddForm) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Add Shipping Address
          </CardTitle>
          <CardDescription>
            Please add your delivery address to continue with checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InlineAddressForm onSuccess={() => setShowAddForm(false)} />
        </CardContent>
      </Card>
    );
  }

  // Show add form inline when user clicks add button
  if (showAddForm && addresses && addresses.length > 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddForm(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-5 w-5 text-primary" />
                Add New Address
              </CardTitle>
              <CardDescription>
                Fill in the details to add a new delivery address
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InlineAddressForm onSuccess={() => setShowAddForm(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              Shipping Address
            </CardTitle>
            <CardDescription>
              Choose where you want your order delivered
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAddress?.id}
          onValueChange={(value) => {
            const address = addresses?.find((a) => a.id === value);
            if (address) onSelectAddress(address);
          }}
          className="space-y-3"
        >
          {addresses?.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onSelect={onSelectAddress}
            />
          ))}
        </RadioGroup>

        {/* Mobile Add Button */}
        <Button 
          variant="outline" 
          className="w-full sm:hidden"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </CardContent>
    </Card>
  );
}
