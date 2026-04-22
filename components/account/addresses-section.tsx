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
        <Card className="rounded-[2rem] border-none shadow-sm bg-background overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-muted/20">
                <CardTitle className="h4 !text-xl font-bold">Delivery Addresses</CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="rounded-full px-4 py-2 h-auto font-bold text-accent hover:bg-accent/5 transition-all gap-2"
                >
                    <Plus className="w-3.5 h-3.5" />
                    New Address
                </Button>
            </CardHeader>
            <CardContent className="p-6">
                {!addresses || addresses.length === 0 ? (
                    <div className="text-center py-12 bg-muted/10 rounded-[2rem]">
                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <MapPin className="w-6 h-6 text-accent/30" />
                        </div>
                        <p className="p-sm text-muted-foreground mb-6">No saved addresses</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddDialogOpen(true)}
                            className="rounded-full px-6 py-2.5 h-auto font-bold border-muted-foreground/10 hover:bg-muted transition-all"
                        >
                            Add Address
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className="relative p-5 rounded-2xl border-none bg-muted/20 hover:bg-muted/40 transition-all duration-300 group/addr shadow-sm"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                            {getAddressTypeIcon(address.addressType)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="p-xs uppercase font-bold tracking-wider text-[10px] opacity-60">
                                                    {address.addressType || 'OTHER'}
                                                </p>
                                                {address.isDefault && (
                                                    <Badge className="px-1.5 py-0 rounded-full font-bold text-[7px] uppercase tracking-tighter bg-accent text-white border-none h-3.5">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full bg-background/50 hover:bg-background transition-all shadow-sm"
                                                disabled={isDeleting || isSettingDefault}
                                            >
                                                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-xl">
                                            {!address.isDefault && (
                                                <DropdownMenuItem
                                                    onClick={() => handleSetDefault(address.id)}
                                                    className="rounded-xl px-4 py-2 cursor-pointer"
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
                                                className="rounded-xl px-4 py-2 text-destructive cursor-pointer"
                                            >
                                                Delete Address
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-0.5 pl-12">
                                    {address.streetAddress && (
                                        <p className="text-sm font-bold text-foreground/80 leading-snug truncate">{address.streetAddress}</p>
                                    )}
                                    <p className="text-[11px] text-muted-foreground">
                                        {address.city}, {address.state}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {address.country} {address.postalCode}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <AddAddressDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-[2rem] p-8 border-none shadow-2xl max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="h4 !text-xl">Delete Address</AlertDialogTitle>
                        <AlertDialogDescription className="p-sm text-muted-foreground">
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-4 gap-2">
                        <AlertDialogCancel className="rounded-full px-6 h-10 font-bold border-muted-foreground/10 hover:bg-muted transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => addressToDelete && handleDelete(addressToDelete)}
                            className="rounded-full px-6 h-10 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
