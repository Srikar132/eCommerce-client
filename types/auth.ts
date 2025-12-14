
export interface User {
    id: string;
    email: string;
    username: string;
    phone?: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    phone?: string;
}

export interface AuthResponse {
    message : string;
    user: User;
}