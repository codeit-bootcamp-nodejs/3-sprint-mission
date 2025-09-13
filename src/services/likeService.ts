import { CustomError } from '../utils/CustomError.js';
import { LikeTargetType, PublicLikedProduct, PublicLikedArticle } from '../types/like.js';
import {
  countLike,
  createLike,
  deleteLike,
  findUserLikedProducts,
  findUserLikedArticles,
} from '../repositories/likeRepository.js';

/**
 * @function likeTarget
 * 
 * @description
 * 주어진 리소스(product 또는 article)에 대해 좋아요를 추가합니다.
 * type에 따라 동적으로 productId 또는 articleId를 설정합니다.
 * unlikeTarget(), isTargetLiked()도 이와 유사한 방식으로 동작합니다.
 * 
 * @param {number} userId - 좋아요를 누른 유저의 ID
 * @param {number} targetId - 대상 리소스의 ID
 * @param {'product' | 'article'} type - 리소스 타입 
 * @returns {Promise<Like>} 생성된 Like 레코드
 */
export const likeTarget = async (userId: number, targetId: number, type: LikeTargetType) => {
  if (!Number.isInteger(targetId) || targetId <= 0)
    throw new CustomError('대상 ID가 올바르지 않습니다.', 400);

  const isLiked = await countLike(userId, targetId, type);
  if (isLiked > 0) throw new CustomError('이미 좋아요를 눌렀습니다.', 400);

  return createLike(userId, targetId, type);
};

export const unlikeTarget = async (userId: number, targetId: number, type: LikeTargetType) => {
  if (!Number.isInteger(targetId) || targetId <= 0)
    throw new CustomError('대상 ID가 올바르지 않습니다.', 400);

  const result = await deleteLike(userId, targetId, type);
  if (result.count === 0) throw new CustomError('좋아요가 존재하지 않습니다.', 404);

  return result;
};

export const isTargetLiked = async (userId: number, targetId: number, type: LikeTargetType) => {
  return (await countLike(userId, targetId, type)) > 0;
};

export const getUserLikedProducts = async (userId: number): Promise<PublicLikedProduct[]> => {
  return findUserLikedProducts(userId);
};

export const getUserLikedArticles = async (userId: number): Promise<PublicLikedArticle[]> => {
  return findUserLikedArticles(userId);
};