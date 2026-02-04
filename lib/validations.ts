import { z } from 'zod';

const phoneSchema = z.object({
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
