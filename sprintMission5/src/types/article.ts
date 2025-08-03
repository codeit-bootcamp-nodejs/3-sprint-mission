export interface ArticleDto {
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  userId: string;
}

export interface ArticleWithLikeDto extends ArticleDto {
  isLiked: boolean;
}

/**
 * CreateArticleDto example:
 * {
 *  title: string,
 * content: string | null,
 * userId: string
 * }
 */

export type CreateArticleDto = Omit<ArticleDto, 'id' | 'createdAt'>;

/**
 * PatchArticleDto example:
 * {
 * title: string,
 * content: string | null
 * }
 */

export type PatchArticleDto = Partial<Omit<CreateArticleDto, 'userId'>>;
