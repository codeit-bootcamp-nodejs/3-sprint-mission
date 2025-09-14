import { CustomError } from '../utils/CustomError.js';
import {
  createForProduct,
  createForArticle,
  findForProduct,
  findForArticle,
  findById,
  update,
  remove,
} from '../repositories/commentRepository.js';
import * as articleRepo from '../repositories/articleRepository.js';
import * as notificationService from '../notifications/notificationService.js';

export const createProductComment = async (productId: number, userId: number, content: string) => {
  if (!Number.isInteger(productId) || productId <= 0) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  return createForProduct(productId, userId, content);
};

export const getProductComments = async (
  productId: number,
  options: { cursor?: number; limit?: number }
) => {
  if (!Number.isInteger(productId) || productId <= 0) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  const { cursor, limit = 10 } = options;
  return findForProduct(productId, cursor, limit);
};

export const createArticleComment = async (
  articleId: number,
  userId: number,
  content: string
) => {
  if (!Number.isInteger(articleId) || articleId <= 0)
    throw new CustomError("게시글 ID가 올바르지 않습니다.", 400);

  const comment = await createForArticle(articleId, userId, content);

  /**
   * 본인 게시글에 타인 댓글이 달리면 알림 생성
   */
  const article = await articleRepo.findById(articleId);
  const recipientId = article?.userId;
  if (recipientId && recipientId !== userId) {
    await notificationService.createNewComment({
      recipientUserId: recipientId,
      postId: articleId,
      commentId: comment.id,
      commentPreview: content.slice(0, 80),
    });
  }

  return comment;
};

export const getArticleComments = async (
  articleId: number,
  options: { cursor?: number; limit?: number }
) => {
  if (!Number.isInteger(articleId) || articleId <= 0) throw new CustomError('게시글 ID가 올바르지 않습니다.', 400);

  const { cursor, limit = 10 } = options;
  return findForArticle(articleId, cursor, limit);
};

export const updateComment = async (id: number, userId: number, content: string) => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('댓글 ID가 올바르지 않습니다.', 400);

  const comment = await findById(id);
  if (!comment) throw new CustomError('댓글을 찾을 수 없습니다.', 404);
  if (comment.userId !== userId) throw new CustomError('댓글 수정 권한이 없습니다.', 403);

  return update(id, content);
};

export const deleteComment = async (id: number, userId: number) => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('댓글 ID가 올바르지 않습니다.', 400);

  const comment = await findById(id);
  if (!comment) throw new CustomError('댓글을 찾을 수 없습니다.', 404);
  if (comment.userId !== userId) throw new CustomError('댓글 삭제 권한이 없습니다.', 403);

  return remove(id);
};