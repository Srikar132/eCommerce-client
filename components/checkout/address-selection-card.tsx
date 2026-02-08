"use client";

import { Address } from "@/types/auth";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface AddressSelectionCardProps {
    address: Address;
    isSelected: boolean;
    onSelect: () => void;
}

export default function AddressSelectionCard({
    address,
    isSelected,
    onSelect,
}: AddressSelectionCardProps) {
    return (
        <Card
            className={`p-4 cursor-pointer transition-all ${
                isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
            }`}
            onClick={onSelect}
        >
            <div className="flex items-start gap-3">
                <RadioGroupItem
                    value={address.id}
                    checked={isSelected}
                    className="mt-1"
                />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                                Default
                            </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                            {address.addressType}
                        </Badge>
                    </div>

                    <div className="text-sm text-foreground space-y-1">
                        <p className="font-medium">{address.streetAddress}</p>
                        <p className="text-muted-foreground">
                            {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-muted-foreground">{address.country}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
