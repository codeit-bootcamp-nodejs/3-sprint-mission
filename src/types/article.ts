import type { Article } from '@prisma/client';

/**
 * Article 기본 모델
 */
export type DBArticle = Article;

/**
 * Article 조회
 */
export type PublicArticle = Omit<DBArticle, 'updatedAt' | 'userId'>;

/**
 * Article 생성 DTO
 */
export interface CreateArticleDto
  extends Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
  userId: NonNullable<Article['userId']>;
}

/**
 * Article 업데이트 DTO
 */
export interface UpdateArticleDto {
  title?: Article['title'];
  content?: Article['content'];
}

/**
 * Article 목록 조회 DTO
 */
export interface ListArticlesQueryDto {
  offset: number;
  limit: number;
  search: string;
}