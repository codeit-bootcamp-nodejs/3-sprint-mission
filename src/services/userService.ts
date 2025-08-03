import { HttpError } from "../types/error";
import {
  UserDto,
  CreateUserDto,
  PatchUserDto,
  filterSensitiveUserData,
} from "../types/user";
import { ProductDto } from "../types/product";
import userRepository from "../repositories/userRepository"
import productRepository from "../repositories/productRepository";
import { hashPassword } from "../utils/passwordUtil";
import { checkUser } from "../utils/checkUser";

const filterSensitiveUserData = (user: UserDto): filterSensitiveUserData => {
  const { password, refreshToken, updatedAt, ...rest } = user
  return rest
}

const userCreate = async (user: CreateUserDto): Promise<filterSensitiveUserData> => {
  const existedUser = await userRepository.findbyEmail(user.email);
  if (existedUser) {
    throw new HttpError('이미 존재하는 이메일입니다.', 409);
  }
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;
  const createUser = await userRepository.createUser(user);
  return filterSensitiveUserData(createUser);
}

const updateUser = async (data: PatchUserDto, userId?: string): Promise<filterSensitiveUserData> => {
  const user = await checkUser(userId);
  const updatedUser = await userRepository.updateUser(user.id, data)
  return filterSensitiveUserData(updatedUser);
}

const getUser = async (userId?: string): Promise<filterSensitiveUserData> => {
  const user = await checkUser(userId);
  return filterSensitiveUserData(user);
}

const getUserRegisteredProducts = async (userId?: string): Promise<{ userEmail: string; userNickname: string; products: ProductDto[] }> => {
  const user = await checkUser(userId);
  const products = await productRepository.getUserRegisteredProducts(user.id);
  const data = { userEmail: user.email, userNickname: user.nickname, products };
  return data;
}

const getUserLikedProducts = async (userId?: string): Promise<ProductDto[]> => {
  const user = await checkUser(userId);
  const products = await productRepository.getUserLikedProducts(user.id);
  return products;
}

export default {
  userCreate,
  updateUser,
  getUser,
  getUserRegisteredProducts,
  getUserLikedProducts
}