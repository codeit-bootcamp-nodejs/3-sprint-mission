import type { Like } from '@prisma/client';

/**
 * Like 기본 모델
 */
export type DBLike = Like;

/**
 * 좋아요 대상 타입
 */
export type LikeTargetType = 'product' | 'article';

/**
 * 좋아요 목록 조회 반환 타입 (공통)
 */
export interface PublicLikedTarget {
  id: number;
  titleOrName: string;
  createdAt: Date;
}

/**
 * 사용자 좋아요 목록 반환용 상품 타입
 */
export interface PublicLikedProduct {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
}

/**
 * 사용자 좋아요 목록 반환용 게시글 타입
 */
export interface PublicLikedArticle {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}