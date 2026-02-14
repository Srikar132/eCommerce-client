import { z } from 'zod';

// Enhanced phone schema with additional security
export const phoneSchema = z.object({
    fullPhone: z
        .string()
        .min(13, 'Please enter country code and phone number')
        .max(17, 'Phone number is too long')
        .regex(/^\+\d{1,4}\d{10}$/, 'Invalid format. Use +91 followed by 10 digits')
        .transform(phone => phone.trim().replace(/\s+/g, '')), // Sanitize input
    acceptTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: "You must accept the terms and conditions",
        }),
});

// Secure OTP validation schema
export const otpSchema = z.object({
    otp: z
        .string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers')
        .transform(otp => otp.trim()),
    phone: z
        .string()
        .min(10, 'Phone number is required')
        .regex(/^\+\d{1,4}\d{10}$/, 'Invalid phone format'),
});

// Enhanced authentication schemas
export const loginSchema = z.object({
    phone: z
        .string()
        .min(10, 'Phone number is required')
        .max(17, 'Phone number is too long')
        .regex(/^\+\d{1,4}\d{10}$/, 'Invalid phone format')
        .transform(phone => phone.trim().replace(/[^\d+]/g, '')), // Sanitize
    otp: z
        .string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

// Security-enhanced user input sanitization
const sanitizeString = (str: string) => str.trim().replace(/[<>\"'&]/g, '');

// Zod validation schema
export const reviewFormSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
    title: z.string().max(100, "Title must be less than 100 characters").optional()
        .transform(val => val ? sanitizeString(val) : val),
    comment: z.string()
        .min(10, "Review must be at least 10 characters")
        .max(1000, "Review must be less than 1000 characters")
        .transform(sanitizeString),
});

// Account details validation schema with XSS protection
export const accountDetailsSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters")
        .transform(sanitizeString),
    email: z.string()
        .email("Please enter a valid email address")
        .max(254, "Email is too long")
        .transform(email => email.toLowerCase().trim()),
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

// Product-related validation schemas

// Product image schema
export const productImageSchema = z.object({
    imageUrl: z.string().url("Invalid image URL"),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
    displayOrder: z.number().default(0),
});

// Product variant schema
export const productVariantSchema = z.object({
    size: z.string().min(1, "Size is required"),
    color: z.string().min(1, "Color is required"),
    colorHex: z.string().optional(),
    stockQuantity: z.coerce.number().min(0, "Stock quantity must be non-negative"),
    additionalPrice: z.coerce.number().default(0),
    sku: z.string().optional(), // SKU is auto-generated
});

// Main product form validation schema
export const productFormSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(200, "Name must be less than 200 characters")
        .transform(sanitizeString),
    description: z.string()
        .max(2000, "Description must be less than 2000 characters")
        .optional()
        .transform(val => val ? sanitizeString(val) : val),
    basePrice: z.coerce.number().min(0, "Price must be greater than 0"),
    sku: z.string()
        .min(3, "SKU must be at least 3 characters")
        .max(50, "SKU must be less than 50 characters")
        .regex(/^[A-Za-z0-9-_]+$/, "SKU can only contain letters, numbers, hyphens, and underscores"),
    material: z.string()
        .max(100, "Material must be less than 100 characters")
        .optional()
        .transform(val => val ? sanitizeString(val) : val),
    careInstructions: z.string()
        .max(1000, "Care instructions must be less than 1000 characters")
        .optional()
        .transform(val => val ? sanitizeString(val) : val),
    categoryId: z.string().min(1, "Category is required"),
    isActive: z.boolean().default(true),
    isDraft: z.boolean().default(false),
    images: z.array(productImageSchema).min(1, "At least one image is required"),
    variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
