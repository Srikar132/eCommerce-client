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
        <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-base flex items-center gap-2.5 font-semibold">
                    <Settings className="h-4 w-4 text-primary/80" />
                    Publishing Status
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <StatusToggle
                    control={control}
                    name="isActive"
                    label="Active"
                    description="Visible to customers"
                    disabled={disabled}
                />
                <StatusToggle
                    control={control}
                    name="isDraft"
                    label="Draft"
                    description="Save for later"
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
                <FormItem className="flex items-center justify-between rounded-xl border border-border/40 p-3.5 bg-muted/10 hover:bg-muted/20 transition-colors">
                    <div className="space-y-0.5">
                        <FormLabel className="text-sm font-semibold">{label}</FormLabel>
                        <p className="text-[10px] text-muted-foreground font-medium">{description}</p>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                            className="scale-90"
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
        <Card className="border border-border/50 shadow-sm bg-primary/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-primary/10">
                <CardTitle className="text-base font-semibold">Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                <SummaryItem label="Uploaded Images" value={imageCount} />
                <SummaryItem label="Product Variants" value={variantCount} />
                <div className="pt-2 border-t border-primary/5">
                    <SummaryItem label="Total Stock Available" value={totalStock} isHighlight />
                </div>
            </CardContent>
        </Card>
    );
}

interface SummaryItemProps {
    label: string;
    value: number;
    isHighlight?: boolean;
}

function SummaryItem({ label, value, isHighlight }: SummaryItemProps) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className={isHighlight ? "font-semibold" : "text-muted-foreground font-medium"}>{label}</span>
            <Badge variant={isHighlight ? "default" : "secondary"} className="rounded-full px-2.5">
                {value}
            </Badge>
        </div>
    );
}
