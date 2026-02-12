export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedBy?: string;
}