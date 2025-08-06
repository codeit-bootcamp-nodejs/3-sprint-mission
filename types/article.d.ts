import { Article } from "@prisma/client";

export type CreateArticleDto = Omit<Article, "id" | "createdAt" | "updatedAt">

export type UpdateArticleDto = Partial<Omit<CreateArticleDto, "userId">>

export interface CreateArticleCommentDto {
    content: string,
    articleId: string,
    userId: number | undefined
}

export interface UpdateArticleCommentDto {
    content: string,
}

export interface likedArticle extends Article {
    isLiked: boolean
}
// export type UpdateArticleCommentDto = Partial<CreateArticleCommentDto>