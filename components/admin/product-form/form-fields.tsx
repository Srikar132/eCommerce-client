"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee } from "lucide-react";
import { Control, FieldPath } from "react-hook-form";
import { ProductFormData } from "@/lib/validations";

// Type for scalar fields only (excludes arrays like images and variants)
type ScalarFieldNames = Exclude<FieldPath<ProductFormData>, `images` | `images.${number}` | `images.${number}.${string}` | `variants` | `variants.${number}` | `variants.${number}.${string}`>;

interface FormInputProps {
    control: Control<ProductFormData>;
    name: ScalarFieldNames;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    type?: "text" | "number";
    required?: boolean;
    icon?: React.ReactNode;
}

export function FormInput({
    control,
    name,
    label,
    placeholder,
    disabled,
    type = "text",
    required,
    icon,
}: FormInputProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}{required && " *"}</FormLabel>
                    <FormControl>
                        {icon ? (
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    {icon}
                                </span>
                                <Input
                                    type={type}
                                    placeholder={placeholder}
                                    className="pl-9"
                                    disabled={disabled}
                                    {...field}
                                    value={field.value as string | number ?? ""}
                                />
                            </div>
                        ) : (
                            <Input
                                type={type}
                                placeholder={placeholder}
                                disabled={disabled}
                                {...field}
                                value={field.value as string | number ?? ""}
                            />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface FormTextareaProps {
    control: Control<ProductFormData>;
    name: ScalarFieldNames;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    minHeight?: string;
}

export function FormTextarea({
    control,
    name,
    label,
    placeholder,
    disabled,
    minHeight = "min-h-25",
}: FormTextareaProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className={`${minHeight} resize-none`}
                            disabled={disabled}
                            {...field}
                            value={field.value as string}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface FormSelectProps {
    control: Control<ProductFormData>;
    name: ScalarFieldNames;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    options: { value: string; label: string }[];
}

export function FormSelect({
    control,
    name,
    label,
    placeholder,
    disabled,
    required,
    options,
}: FormSelectProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}{required && " *"}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface PriceInputProps {
    control: Control<ProductFormData>;
    name: ScalarFieldNames;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

export function PriceInput({
    control,
    name,
    label,
    placeholder = "0",
    disabled,
    required,
}: PriceInputProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}{required && " *"}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                placeholder={placeholder}
                                className="pl-9"
                                disabled={disabled}
                                {...field}
                                value={field.value as string | number ?? ""}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
