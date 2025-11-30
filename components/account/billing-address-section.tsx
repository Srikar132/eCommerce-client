'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Address } from '@/lib/types';

interface BillingAddressSectionProps {
    addresses: Address[];
    onAddAddress: () => void;
    onEditAddress: (addressId: string) => void;
    onDeleteAddress: (addressId: string) => void;
    onSetDefaultAddress: (addressId: string) => void;
}

export const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
                                                                                addresses,
                                                                                onAddAddress,
                                                                                onEditAddress,
                                                                                onDeleteAddress,
                                                                                onSetDefaultAddress
                                                                            }) => {
    const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);

    const confirmDelete = () => {
        if (deleteAddressId) {
            onDeleteAddress(deleteAddressId);
            setDeleteAddressId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-light tracking-wide mb-4">EDIT BILLING ADDRESS</h1>
                <p className="text-zinc-600 font-light leading-relaxed">
                    Manage your saved addresses for billing and delivery.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {addresses.map((address) => (
                    <Card key={address.id} className="border-zinc-200 rounded-none hover:border-zinc-300 transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-light tracking-wide">{address.type}</CardTitle>
                                {address.isDefault && (
                                    <Badge className="bg-black text-white rounded-none tracking-widest text-xs px-3 py-1">
                                        DEFAULT
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 space-y-2">
                                <p className="font-bold text-base">{address.name}</p>
                                <p className="text-sm text-zinc-600 font-medium">{address.street}</p>
                                <p className="text-sm text-zinc-600 font-medium">
                                    {address.city}, {address.state} {address.zip}
                                </p>
                            </div>
                            <div className="space-y-3">
                                {!address.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full h-10 border-zinc-300 hover:bg-zinc-100 font-light tracking-wide"
                                        onClick={() => onSetDefaultAddress(address.id)}
                                    >
                                        <Check size={16} className="mr-2" />
                                        Set as Default
                                    </Button>
                                )}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-10 border-zinc-300 hover:bg-zinc-100 font-light"
                                        onClick={() => onEditAddress(address.id)}
                                    >
                                        <Pencil size={16} className="mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1 h-10 bg-black hover:bg-zinc-800 font-light"
                                        onClick={() => setDeleteAddressId(address.id)}
                                        disabled={address.isDefault}
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Card
                    className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 cursor-pointer transition-all hover:bg-zinc-50"
                    onClick={onAddAddress}
                >
                    <CardContent className="flex flex-col items-center justify-center min-h-[280px] p-6">
                        <Plus size={56} className="text-zinc-400 mb-4" strokeWidth={1} />
                        <p className="font-light text-lg tracking-wide mb-2">Add New Address</p>
                        <p className="text-sm text-zinc-500 font-light">Save address for delivery</p>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteAddressId} onOpenChange={() => setDeleteAddressId(null)}>
                <AlertDialogContent className="border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-light tracking-wide">Delete Address</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-zinc-600 leading-relaxed">
                            Are you sure you want to remove this address? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-10 px-6 border-zinc-300 hover:bg-zinc-100 font-light tracking-wide">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="h-10 px-6 bg-black hover:bg-zinc-800 font-light tracking-wide" onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};