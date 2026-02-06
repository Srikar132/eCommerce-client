'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddAddress } from '@/lib/tanstack/queries/address.queries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '@/lib/validations';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

interface AddAddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type AddressFormData = z.infer<typeof addressSchema>;

export function AddAddressDialog({ open, onOpenChange }: AddAddressDialogProps) {
    const { mutate: addAddress, isPending } = useAddAddress();

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addressType: 'HOME',
            streetAddress: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: '',
            isDefault: false,
        },
    });

    const onSubmit = (data: AddressFormData) => {
        addAddress(data, {
            onSuccess: (result) => {
                if (result.success) {
                    toast.success(result.message);
                    onOpenChange(false);
                    // Reset form
                    form.reset();
                } else {
                    toast.error(result.error);
                }
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to add address');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>
                                Add a new delivery address to your account.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="addressType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="HOME">Home</SelectItem>
                                                <SelectItem value="OFFICE">Office</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="streetAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Building, Apartment, Suite, etc."
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter city"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter state"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter country"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter postal code"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Add Address
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
