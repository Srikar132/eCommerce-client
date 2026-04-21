"use client";

import { Address } from "@/types/auth";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

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
        <div
            className={cn(
                "p-8 cursor-pointer transition-all duration-500 rounded-[2.5rem] border-2 relative overflow-hidden group",
                isSelected
                    ? "border-black bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                    : "border-foreground/5 bg-foreground/[0.01] hover:border-foreground/10 hover:bg-white"
            )}
            onClick={onSelect}
        >
            {/* Selection Glow */}
            {isSelected && (
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
            )}

            <div className="absolute top-8 right-8">
                <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isSelected ? "border-black bg-black" : "border-foreground/10"
                )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300" />}
                </div>
            </div>

            <div className="flex items-start gap-6">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        {address.isDefault && (
                            <span className="px-4 py-1.5 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-[0.2em]">
                                Primary
                            </span>
                        )}
                        <span className="px-4 py-1.5 rounded-full bg-foreground/[0.03] text-foreground/40 text-[9px] font-black uppercase tracking-[0.2em] border border-foreground/5">
                            {address.addressType}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xl font-black tracking-tighter text-foreground leading-none">{address.streetAddress}</p>
                        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-[80%]">
                            {address.city}, {address.state} {address.postalCode}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">{address.country}</p>
                        </div>
                    </div>
                </div>
            </div>

            <RadioGroupItem
                value={address.id}
                checked={isSelected}
                className="sr-only" // Hidden but accessible
            />
        </div>
    );
}
