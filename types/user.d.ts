import { User } from "@prisma/client";

export type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt" | "refreshToken">

export type UpdateUserDto = Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "email" | "password">>

/**
 * 민감 정보 제거 후 리턴용 타입
 */
export type filteredUser = Omit<User, "password" | "refreshToken">

/**
 * 비밀번호 변경시 전달할 파라미터 타입
 */
export interface ChangePasswordDto {
    currentPassword: string,
    newPassword: string,
}