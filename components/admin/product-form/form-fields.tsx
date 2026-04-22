"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee } from "lucide-react";
import { Control, FieldPath } from "react-hook-form";
import { ProductFormData } from "@/lib/validations";

// Type for scalar fields (including nested variant fields)
type ScalarFieldNames = FieldPath<ProductFormData>;

interface BaseFieldProps {
    control: Control<ProductFormData>;
    name: ScalarFieldNames;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    labelClassName?: string;
}

interface FormInputProps extends BaseFieldProps {
    type?: "text" | "number";
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
    labelClassName,
}: FormInputProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClassName}>{label}{required && " *"}</FormLabel>
                    <FormControl>
                        {icon ? (
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                                    <span className="text-muted-foreground group-focus-within:text-primary transition-colors">
                                        {icon}
                                    </span>
                                </div>
                                <Input
                                    type={type}
                                    placeholder={placeholder}
                                    className="pl-10 h-11 transition-all focus:ring-1 focus:ring-primary/20 border-border/60"
                                    disabled={disabled}
                                    {...field}
                                    value={field.value as string | number ?? ""}
                                />
                            </div>
                        ) : (
                            <Input
                                type={type}
                                placeholder={placeholder}
                                className="h-11 transition-all focus:ring-1 focus:ring-primary/20 border-border/60"
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

interface FormTextareaProps extends BaseFieldProps {
    minHeight?: string;
}

export function FormTextarea({
    control,
    name,
    label,
    placeholder,
    disabled,
    minHeight = "min-h-25",
    labelClassName,
}: FormTextareaProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClassName}>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className={`${minHeight} resize-none transition-all focus:ring-1 focus:ring-primary/20 border-border/60`}
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

interface FormSelectProps extends BaseFieldProps {
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
    labelClassName,
}: FormSelectProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClassName}>{label}{required && " *"}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger className="h-11 transition-all focus:ring-1 focus:ring-primary/20 border-border/60">
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

export function PriceInput({
    control,
    name,
    label,
    placeholder = "0",
    disabled,
    required,
    labelClassName,
}: BaseFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClassName}>{label}{required && " *"}</FormLabel>
                    <FormControl>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                type="number"
                                placeholder={placeholder}
                                className="pl-9 h-11 transition-all focus:ring-1 focus:ring-primary/20 border-border/60"
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
