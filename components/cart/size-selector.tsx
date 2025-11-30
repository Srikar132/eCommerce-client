// components/cart/size-selector.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SizeSelectorProps {
    selectedSize: string;
    onChange: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onChange }) => (
    <Select value={selectedSize} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[220px] h-9 text-xs sm:text-sm font-medium">
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="UK 12 Short (Medium)">UK 12 Short (Medium)</SelectItem>
            <SelectItem value="UK 14 Short (Medium)">UK 14 Short (Medium)</SelectItem>
            <SelectItem value="UK 16 Short (Medium)">UK 16 Short (Medium)</SelectItem>
        </SelectContent>
    </Select>
);