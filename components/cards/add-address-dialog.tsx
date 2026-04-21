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
            <DialogContent className="sm:max-w-xl rounded-[2rem] p-8 md:p-10 border-none shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="h3 !text-2xl">Add New Address</DialogTitle>
                            <DialogDescription className="p-sm text-muted-foreground">
                                Save a new delivery address for your future orders.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="addressType"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Address Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-2xl h-12 border-muted-foreground/10 focus:ring-accent/20 bg-muted/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-none shadow-xl p-2">
                                                <SelectItem value="HOME" className="rounded-xl px-4 py-2">Home</SelectItem>
                                                <SelectItem value="OFFICE" className="rounded-xl px-4 py-2">Office</SelectItem>
                                                <SelectItem value="OTHER" className="rounded-xl px-4 py-2">Other</SelectItem>
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
                                    <FormItem className="space-y-2">
                                        <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Street Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Building, Apartment, Suite, etc."
                                                disabled={isPending}
                                                className="rounded-2xl h-12 border-muted-foreground/10 focus:border-accent/30 transition-all bg-muted/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">City *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter city"
                                                    disabled={isPending}
                                                    className="rounded-2xl h-12 border-muted-foreground/10 focus:border-accent/30 transition-all bg-muted/20"
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
                                        <FormItem className="space-y-2">
                                            <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">State *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter state"
                                                    disabled={isPending}
                                                    className="rounded-2xl h-12 border-muted-foreground/10 focus:border-accent/30 transition-all bg-muted/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Country *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter country"
                                                    disabled={isPending}
                                                    className="rounded-2xl h-12 border-muted-foreground/10 focus:border-accent/30 transition-all bg-muted/20"
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
                                        <FormItem className="space-y-2">
                                            <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Postal Code *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter postal code"
                                                    disabled={isPending}
                                                    className="rounded-2xl h-12 border-muted-foreground/10 focus:border-accent/30 transition-all bg-muted/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-between gap-4 pt-4 border-t border-muted-foreground/10">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                                className="rounded-full px-8 h-12 font-bold hover:bg-muted transition-all"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isPending}
                                className="rounded-full px-10 h-12 font-bold bg-accent text-white hover:bg-accent/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add Address'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
