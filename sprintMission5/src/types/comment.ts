export interface CommentDto {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  productId?: string | null;
  articleId?: string | null;
}

/**
 * CreateCommentDto example:
 * {
 * content: string,
 * userId: string,
 * productId?: string | null,
 * articleId?: string | null
 * }
 */
export type BoardTypeDto = { [productId: string] : string } | { [articleId: string] : string };

/**
 * PatchCommentDto example:
 * {
 * content: string
 * }
 */
export type CreateCommentDto = Omit<CommentDto, 'id' | 'createdAt'>;

/**
 * PatchCommentDto example:
 * {
 * content: string
 * }
 */
export type PatchCommentDto = Partial<Omit<CreateCommentDto, 'userId' | 'productId' | 'articleId'>>;
