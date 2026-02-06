import { z } from 'zod';

export const phoneSchema = z.object({
    fullPhone: z
        .string()
        .min(13, 'Please enter country code and phone number')
        .regex(/^\+\d{1,4}\d{10}$/, 'Invalid format. Use +91 followed by 10 digits'),
    acceptTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: "You must accept the terms and conditions",
        }),
});



// Zod validation schema
export const reviewFormSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
    title: z.string().max(100, "Title must be less than 100 characters").optional(),
    comment: z.string()
        .min(10, "Review must be at least 10 characters")
        .max(1000, "Review must be less than 1000 characters"),
});

// Account details validation schema
export const accountDetailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
});

// Address validation schema
export const addressSchema = z.object({
    addressType: z.enum(['HOME', 'OFFICE', 'OTHER']),
    streetAddress: z.string().max(200, "Street address must be less than 200 characters").optional(),
    city: z.string().min(2, "City is required").max(100, "City must be less than 100 characters"),
    state: z.string().min(2, "State is required").max(100, "State must be less than 100 characters"),
    country: z.string().min(2, "Country is required").max(100, "Country must be less than 100 characters"),
    postalCode: z.string().min(3, "Postal code is required").max(20, "Postal code must be less than 20 characters"),
    isDefault: z.boolean().optional(),
});
