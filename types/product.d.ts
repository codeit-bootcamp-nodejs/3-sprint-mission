import { Product } from "@prisma/client";

export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">

export type UpdateProductDto = Partial<Omit<CreateProductDto, "userId">>

export interface CreateProductCommentDto {
    content: string,
    productId: string,
    userId: number | undefined
}

export interface UpdateProductCommentDto {
    content: string,
}

export interface likedProduct extends Product {
    isLiked: boolean
}