export interface User {
    _id: string;
    name: string;
    email: string;
    username: string;
    bio: string;
    followers: string[];
    following: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Article {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    author: User;
    likes: string[];
    likesCount: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    content: string;
    blog: string;
    author: User;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    _id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    pages: number;
}
