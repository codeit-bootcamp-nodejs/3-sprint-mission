import { CustomError } from '../utils/CustomError.js';
import * as repo from './notificationRepository.js';
import { broadcast } from './notificationEmitter.js';
import {
  NotificationDTO,
  NotificationType,
  NotificationEntity} from './notificationTypes.js';

/**
 * 목록 조회 (커서 페이징)
 * @param userId - 로그인 사용자
 * @param cursor - 마지막으로 본 알림 id
 * @param limit - 페이지 크기 (기본 20)
 */
export const list = async (
  userId: number,
  cursor?: number,
  limit: number = 20
): Promise<NotificationDTO[]> => {
  if (!Number.isInteger(userId)) throw new CustomError('사용자 ID가 올바르지 않습니다', 400);
  // TODO: 커서/리밋 유효성 검증
  return repo.findByUser(userId, { cursor, limit });
};

/**
 * 미확인(안 읽음) 알림 개수
 */
export const countUnread = async (userId: number): Promise<number> => {
  if (!Number.isInteger(userId)) throw new CustomError('사용자 ID가 올바르지 않습니다', 400);
  return repo.countUnread(userId);
};

/**
 * 단건 읽음 처리
 */
export const markRead = async (id: number, userId: number): Promise<NotificationDTO> => {
  if (!Number.isInteger(id)) throw new CustomError('알림 ID가 올바르지 않습니다', 400);
  if (!Number.isInteger(userId)) throw new CustomError('사용자 ID가 올바르지 않습니다', 400);

  // TODO: 소유권 검사(리포에서 WHERE id AND userId)
  const updated = await repo.markRead({ id, userId });

  return updated;
};

/**
 * 일괄 읽음 처리 (옵션: 특정 시점 이전만)
 */
export const markReadAll = async (
  userId: number,
  before?: Date
): Promise<{ affected: number }> => {
  if (!Number.isInteger(userId)) throw new CustomError('사용자 ID가 올바르지 않습니다.', 400);
  // TODO: before 유효성 검사
  const affected = await repo.markReadBefore({ userId, before });

  return { affected };
};

/**
 * ====================
 * 생성 트리거
 * ====================
 */

/**
 * 가격 변경 알림 생성
 */
export const createPriceChange = async (args: {
  recipientUserId: number;
  productId: number;
  oldPrice: number;
  newPrice: number;
}): Promise<NotificationDTO> => {
  const { recipientUserId, productId, oldPrice, newPrice } = args;
  if (!Number.isInteger(recipientUserId)) throw new CustomError('사용자 ID가 올바르지 않습니다.', 400);
  if (!Number.isInteger(productId)) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  const title = '관심 상품 가격이 변경됐어요.';
  const body = '좋아요한 상품의 가격이 변경됐어요.';
  const metadata = { productId, oldPrice, newPrice };
  const dedupKey = `product:${productId}:newPrice:${newPrice}`;

  const created = await repo.insert({
    userId: recipientUserId,
    type: NotificationType.PRICE_CHANGE,
    entityType: NotificationEntity.PRODUCT,
    entityId: productId,
    title,
    body,
    metadata,
    dedupKey,
  });

  broadcast(recipientUserId, created);
  return created;
};

/**
 * 내 게시글에 새 댓글 알림 생성
 */
export const createNewComment = async (args: {
  recipientUserId: number;
  postId: number;
  commentId: number;
  commentPreview?: string;
}): Promise<NotificationDTO> => {
  const { recipientUserId, postId, commentId, commentPreview } = args;
  if (!Number.isInteger(recipientUserId)) throw new CustomError('사용자 ID가 올바르지 않습니다.', 400);
  if (!Number.isInteger(postId)) throw new CustomError('게시글 ID가 올바르지 않습니다.', 400);
  if (!Number.isInteger(commentId)) throw new CustomError('댓글 ID가 올바르지 않습니다.', 400);

  const title = '새 댓글이 등록되었습니다.';
  const body = '누군가 내 게시글에 댓글을 남겼습니다.';
  const metadata = { postId, commentId, commentPreview };
  const dedupKey = `comment:${commentId}`;

  const created = await repo.insert({
    userId: recipientUserId,
    type: NotificationType.NEW_COMMENT,
    entityType: NotificationEntity.COMMENT,
    entityId: commentId,
    title,
    body,
    metadata,
    dedupKey
  });

  broadcast(recipientUserId, created);
  return created;
};
