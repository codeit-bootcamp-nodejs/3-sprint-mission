import type { User, Product } from '@prisma/client';

/**
 * User 기본 모델
 */
export type DBUser = User;

/**
 * User 조회
 */
export type PublicUser = Omit<DBUser, 'password' | 'refreshToken'>;

/**
 * 사용자 정보 수정 DTO
 */
export interface UpdateUserInfoDto {
  nickname?: string;
  image?: string | null;
}

/**
 * 사용자 비밀번호 변경 DTO
 */
export interface UpdateUserPasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * 사용자 상품 목록 반환 타입
 */
export type PublicUserProduct = Pick<Product, 'id' | 'name' | 'price' | 'createdAt'>;