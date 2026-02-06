


export type UserRole = 'CUSTOMER' | 'ADMIN';

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



export interface Address {
    id: UUID;
    userId : string;
    addressType: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
}


