"use client";

import { useRouter } from "next/navigation";
import { Address } from "@/types";
import { AddressCard } from "@/components/cards/address-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useUserAddresses,
  useDeleteUserAddress,
  useUpdateUserAddress,
} from "@/lib/tanstack/queries/user-profile.queries";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_ADDRESSES = 5;

const AddressSection = () => {
  const router = useRouter();
  const { data: addresses, isLoading } = useUserAddresses();
  const deleteAddressMutation = useDeleteUserAddress();
  const updateAddressMutation = useUpdateUserAddress();


  console.log("Addresses:", addresses);

  const handleEdit = (address: Address) => {
    // Navigate to edit page with address data
    router.push(`/account/saved-addresses/edit/${address.id}`);
  };

  const handleDelete = (addressId: string) => {
    deleteAddressMutation.mutate(addressId);
  };

  const handleSetDefault = (addressId: string) => {
    const addressToUpdate = addresses?.find((addr) => addr.id === addressId);
    if (!addressToUpdate) return;

    updateAddressMutation.mutate({
      id: addressId,
      data: {
        addressType: addressToUpdate.addressType,
        streetAddress: addressToUpdate.streetAddress,
        city: addressToUpdate.city,
        state: addressToUpdate.state,
        postalCode: addressToUpdate.postalCode,
        country: addressToUpdate.country,
        isDefault: true,
      },
    });
  };

  const handleAddNew = () => {
    router.push("/account/saved-addresses/create");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  const addressCount = addresses?.length || 0;
  const canAddMore = addressCount < MAX_ADDRESSES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {addressCount} of {MAX_ADDRESSES} addresses saved
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={!canAddMore}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Address Grid */}
      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              isDeleting={deleteAddressMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first address to get started
          </p>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      )}

      {/* Address Limit Warning */}
      {!canAddMore && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You&apos;ve reached the maximum number of saved addresses ({MAX_ADDRESSES}).
            Please delete an existing address to add a new one.
          </p>
        </div>
      )}
    </div>
  );
};



export default AddressSection;