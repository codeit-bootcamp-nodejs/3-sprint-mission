import type { Comment } from '@prisma/client';

/**
 * Comment 기본 모델
 */
export type DBComment = Comment;

/**
 * Comment 조회
 */
export type PublicComment = Omit<DBComment, 'userId'>;

/**
 * 댓글 생성 DTO
 */
export interface CreateCommentDto {
  content: DBComment['content'];
}

/**
 * 댓글 목록 조회 DTO (커서 기반 페이지네이션)
 */
export interface ListCommentsQueryDto {
  cursor?: number;
  limit: number;
}

/**
 * 댓글 수정 DTO
 */
export interface UpdateCommentDto {
  content: DBComment['content'];
}