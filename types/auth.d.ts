export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: string;


    phone: string;
    phoneVerified: boolean;


    email?: string;
    emailVerified: boolean;
    name?: string;


    role: UserRole;

    acceptTerms: boolean;

    createdAt: string;
    updatedAt: string;

}

// User Params for admin table
export type UserParams = {
    searchQuery?: string;     // Full-text search query (email, phone, name)
    role?: UserRole;          // Filter by role
    page?: number;            // 0-based page number
    limit?: number;           // Page size (items per page)
    sortBy?: "NAME_ASC" | "NAME_DESC" | "EMAIL_ASC" | "EMAIL_DESC" | "ROLE_ASC" | "ROLE_DESC" | "PRODUCTS_ASC" | "PRODUCTS_DESC" | "CREATED_AT_ASC" | "CREATED_AT_DESC"
};

// Extended User interface for admin table (includes product count)
export interface UserWithStats extends User {
    totalProducts: number;    // Total products bought by user
}



export interface Address {
    id: UUID;
    userId: string;
    addressType: string | null;
    streetAddress: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string | Date;
}


