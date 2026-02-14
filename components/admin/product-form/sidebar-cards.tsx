"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Settings } from "lucide-react";
import { Control } from "react-hook-form";
import { ProductFormData } from "@/lib/validations";

interface StatusCardProps {
    control: Control<ProductFormData>;
    disabled: boolean;
}

export function StatusCard({ control, disabled }: StatusCardProps) {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <StatusToggle
                    control={control}
                    name="isActive"
                    label="Active"
                    description="Product visible to customers"
                    disabled={disabled}
                />
                <StatusToggle
                    control={control}
                    name="isDraft"
                    label="Draft"
                    description="Save for later editing"
                    disabled={disabled}
                />
            </CardContent>
        </Card>
    );
}

interface StatusToggleProps {
    control: Control<ProductFormData>;
    name: "isActive" | "isDraft";
    label: string;
    description: string;
    disabled: boolean;
}

function StatusToggle({ control, name, label, description, disabled }: StatusToggleProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <FormLabel className="text-sm font-medium">{label}</FormLabel>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}

interface SummaryCardProps {
    imageCount: number;
    variantCount: number;
    totalStock: number;
}

export function SummaryCard({ imageCount, variantCount, totalStock }: SummaryCardProps) {
    return (
        <Card className="border-0 shadow-md bg-primary/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <SummaryItem label="Images" value={imageCount} />
                <SummaryItem label="Variants" value={variantCount} />
                <SummaryItem label="Total Stock" value={totalStock} />
            </CardContent>
        </Card>
    );
}

interface SummaryItemProps {
    label: string;
    value: number;
}

function SummaryItem({ label, value }: SummaryItemProps) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <Badge variant="secondary">{value}</Badge>
        </div>
    );
}
