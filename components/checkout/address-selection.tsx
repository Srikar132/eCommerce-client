'use client';

import { Address } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MapPin } from 'lucide-react';
import AddressCard from './address-card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  if (!addresses || addresses.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Shipping Address
          </CardTitle>
          <CardDescription>
            Add a delivery address to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You haven't added any addresses yet
              </p>
              <Button variant="default" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>
          </div>
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
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAddress?.id}
          onValueChange={(value) => {
            const address = addresses.find((a) => a.id === value);
            if (address) onSelectAddress(address);
          }}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onSelect={onSelectAddress}
            />
          ))}
        </RadioGroup>

        {/* Mobile Add Button */}
        <Button variant="outline" className="w-full sm:hidden">
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </CardContent>
    </Card>
  );
}
