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
