"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import {
  useUserAddresses,
  useUpdateUserAddress,
} from "@/lib/tanstack/queries/user-profile.queries";
import { Skeleton } from "@/components/ui/skeleton";

const addressFormSchema = z.object({
  addressType: z.string().min(1, "Address type is required"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State name must be at least 2 characters"),
  postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export const EditAddressForm = () => {
  const router = useRouter();
  const params = useParams();
  const addressId = params.id as string;

  const { data: addresses, isLoading } = useUserAddresses();
  const updateAddressMutation = useUpdateUserAddress();

  const address = addresses?.find((addr) => addr.id === addressId);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      addressType: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        addressType: address.addressType,
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    }
  }, [address, form]);

  const onSubmit = async (data: AddressFormValues) => {
    updateAddressMutation.mutate(
      {
        id: addressId,
        data,
      },
      {
        onSuccess: () => {
          router.push("/account/saved-addresses");
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!address) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Address not found</p>
            <Button className="mt-4" onClick={() => router.push("/account/saved-addresses")}>
              Back to Addresses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Edit Address</h1>
          <p className="text-sm text-muted-foreground">
            Update your delivery address details
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Address Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Address Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Address Type</label>
              <Select
                value={form.watch("addressType")}
                onValueChange={(value) => form.setValue("addressType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.addressType && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.addressType.message}
                </p>
              )}
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Street Address</label>
              <Input
                placeholder="House no., Building name, Street"
                {...form.register("streetAddress")}
              />
              {form.formState.errors.streetAddress && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.streetAddress.message}
                </p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input placeholder="Enter city" {...form.register("city")} />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Input placeholder="Enter state" {...form.register("state")} />
                {form.formState.errors.state && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Postal Code</label>
                <Input
                  placeholder="6-digit pincode"
                  maxLength={6}
                  {...form.register("postalCode")}
                />
                {form.formState.errors.postalCode && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.postalCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input {...form.register("country")} disabled />
              </div>
            </div>

            {/* Set as Default */}
            <div className="flex items-start space-x-3 rounded-md border p-4">
              <Checkbox
                checked={form.watch("isDefault")}
                onCheckedChange={(checked) =>
                  form.setValue("isDefault", checked as boolean)
                }
              />
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium">Set as default address</label>
                <p className="text-sm text-muted-foreground">
                  This address will be used by default for all orders
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={updateAddressMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={updateAddressMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateAddressMutation.isPending ? "Updating..." : "Update Address"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
