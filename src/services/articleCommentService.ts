import * as articleCommentRepository from '../repositories/articleCommentRepository';
import {
  CreateCommentArgs,
  UpdateCommentArgs,
  FindAllCommentsArgs,
} from '../../types/articleComment';
import {
  getCursorPaginationOptions,
  calculateNextCursor,
  checkCommentOwnership,
} from '../utils/queryHelpers';
import { HttpError } from '../../types/errors';

// 게시글 댓글 생성 서비스
export const createArticleComment = async (data: CreateCommentArgs) => {
  const newComment = await articleCommentRepository.createArticleCommentRp(data);
  return newComment;
};

// 게시글 댓글 목록 조회 서비스
export const findAllArticleComments = async ({ articleId, cursor, limit }: FindAllCommentsArgs) => {
  const { parsedLimit, ...findManyOptions } = getCursorPaginationOptions({ cursor, limit });
  const comments = await articleCommentRepository.findAllArticleCommentsRp({
    where: { articleId },
    ...findManyOptions,
  });
  const nextCursor = calculateNextCursor(comments, parsedLimit);
  return { comments, nextCursor };
};

// 게시글 댓글 수정 서비스
export const updateArticleComment = async (commentId: string, { content, userId }: UpdateCommentArgs) => {
  if (content === undefined) {
    throw new HttpError('댓글 내용을 입력해주세요.', 400);
  }

  await checkCommentOwnership(commentId, userId, 'ArticleComment');
  const updatedComment = await articleCommentRepository.updateArticleCommentRp(commentId, content);
  return updatedComment;
};

// 게시글 댓글 삭제 서비스
export const deleteArticleComment = async (commentId: string, userId: string) => {
  await checkCommentOwnership(commentId, userId, 'ArticleComment');
  await articleCommentRepository.deleteArticleCommentRp(commentId);
};