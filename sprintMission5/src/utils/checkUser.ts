import { UserDto } from "../types/user";
import { HttpError } from "../types/error";
import userRepository from "../repositories/userRepository";

/**
 * 유저 아이디를 확인하고 해당 유저 정보를 반환합니다.
 * @param userId 
 * @returns user 정보
 * @throws {HttpError} 유저 아이디가 없을 경우 (status 401)
 * @throws {HttpError} 존재하지 않는 유저일 경우 (status 404)
 */

export const checkUser = async (userId?: string): Promise<UserDto> => {
  if (!userId) {
    throw new HttpError('유저 아이디가 없습니다', 401);
  }
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new HttpError('존재하지 않는 유저입니다', 404);
  }
  return user;
}
