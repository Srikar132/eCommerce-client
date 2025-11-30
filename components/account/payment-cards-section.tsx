'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PaymentCard } from '@/lib/types';

interface SavedCardsSectionProps {
    cards: PaymentCard[];
    onAddCard: () => void;
    onEditCard: (cardId: string) => void;
    onDeleteCard: (cardId: string) => void;
    onSetDefaultCard: (cardId: string) => void;
}

export const SavedCardsSection: React.FC<SavedCardsSectionProps> = ({
                                                                        cards,
                                                                        onAddCard,
                                                                        onEditCard,
                                                                        onDeleteCard,
                                                                        onSetDefaultCard
                                                                    }) => {
    const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

    const confirmDelete = () => {
        if (deleteCardId) {
            onDeleteCard(deleteCardId);
            setDeleteCardId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-light tracking-wide mb-4">SAVED CARDS</h1>
                <p className="text-zinc-600 font-light leading-relaxed">
                    Manage your saved payment methods for faster checkout.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {cards.map((card) => (
                    <Card key={card.id} className="bg-zinc-100 hover:border-zinc-300 rounded-none transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-light tracking-wide">{card.brand}</CardTitle>
                                {card.isDefault && (
                                    <Badge className="bg-black text-white rounded-none tracking-widest text-xs px-3 py-1">
                                        DEFAULT
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-2xl font-mono font-light mt-4">
                                •••• {card.last4}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-500 font-light mb-6">Expires: {card.expiry}</p>
                            <div className="space-y-3">
                                {!card.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full h-10 border-zinc-300 hover:bg-zinc-100 font-light tracking-wide"
                                        onClick={() => onSetDefaultCard(card.id)}
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
                                        onClick={() => onEditCard(card.id)}
                                    >
                                        <Pencil size={16} className="mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1 h-10 bg-black hover:bg-zinc-800 font-light"
                                        onClick={() => setDeleteCardId(card.id)}
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
                    onClick={onAddCard}
                >
                    <CardContent className="flex flex-col items-center justify-center min-h-[280px] p-6">
                        <Plus size={56} className="text-zinc-400 mb-4" strokeWidth={1} />
                        <p className="font-light text-lg tracking-wide mb-2">Add New Card</p>
                        <p className="text-sm text-zinc-500 font-light">Save card for faster checkout</p>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
                <AlertDialogContent className="border-zinc-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-light tracking-wide">Delete Payment Card</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-zinc-600 leading-relaxed">
                            Are you sure you want to remove this payment card? This action cannot be undone.
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