export interface UserDto {
  id: string;
  email: string;
  nickname: string;
  image?: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatchUserDto {
  nickname?: string;
  image?: string;
  password?: string;
  refreshToken?: string;
}

/**
 * CreateUserDto example:
 * {
 *  email: string,
 * nickname: string,
 * image?: string,
 * password: string
 * }
 */
export type CreateUserDto = Omit<UserDto, 'id' | 'createdAt' | 'updatedAt' | 'refreshToken'>;

/**
 * filterSensitiveUserData example:
 * {
 *  id: string,
 * email: string,
 * nickname: string,
 * image?: string,
 * createdAt: Date
 * }
 */
export type filterSensitiveUserData = Omit<UserDto, 'password' | 'refreshToken' | 'updatedAt'>;