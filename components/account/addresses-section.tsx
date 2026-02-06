'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Home, Building2, MoreVertical, Star } from 'lucide-react';
import { useUserAddresses, useDeleteAddress, useSetDefaultAddress } from '@/lib/tanstack/queries/address.queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddAddressDialog } from '@/components/cards/add-address-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function AddressesSectionClient() {
    const { data: addresses, isLoading } = useUserAddresses();
    const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
    const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultAddress();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

    const handleDelete = (addressId: string) => {
        deleteAddress(addressId, {
            onSuccess: (result) => {
                if (result.success) {
                    toast.success(result.message);
                    setDeleteDialogOpen(false);
                    setAddressToDelete(null);
                } else {
                    toast.error(result.error);
                }
            },
        });
    };

    const handleSetDefault = (addressId: string) => {
        setDefault(addressId, {
            onSuccess: (result) => {
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.error);
                }
            },
        });
    };

    const getAddressTypeIcon = (type: string | null) => {
        switch (type) {
            case 'HOME':
                return <Home className="w-4 h-4" />;
            case 'OFFICE':
                return <Building2 className="w-4 h-4" />;
            default:
                return <MapPin className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-lg font-semibold">Saved Addresses</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddDialogOpen(true)}
                        className="gap-2 hover:bg-accent"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>
                </CardHeader>
                <CardContent className="pt-3">
                    {!addresses || addresses.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                <MapPin className="w-6 h-6 text-muted-foreground/60" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                No addresses saved yet
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddDialogOpen(true)}
                                className="hover:bg-accent"
                            >
                                Add Your First Address
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="relative p-3 rounded-md border bg-card hover:bg-accent/50 transition-all duration-200 group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-full bg-primary/10 shrink-0">
                                                {getAddressTypeIcon(address.addressType)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">
                                                        {address.addressType || 'OTHER'}
                                                    </p>
                                                    {address.isDefault && (
                                                        <Badge variant="default" className="text-[10px] h-4 px-1.5">
                                                            <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                                            Default
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    disabled={isDeleting || isSettingDefault}
                                                >
                                                    <MoreVertical className="w-3.5 h-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {!address.isDefault && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleSetDefault(address.id)}
                                                    >
                                                        <Star className="w-4 h-4 mr-2" />
                                                        Set as Default
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setAddressToDelete(address.id);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                    className="text-destructive"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Address Details */}
                                    <div className="space-y-0.5 text-sm pl-8">
                                        {address.streetAddress && (
                                            <p className="text-foreground/90">{address.streetAddress}</p>
                                        )}
                                        <p className="text-muted-foreground text-xs">
                                            {address.city}, {address.state}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {address.country} - {address.postalCode}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddAddressDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => addressToDelete && handleDelete(addressToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
