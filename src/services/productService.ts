import productRepository from "../repositories/productRepository";
import { eventBus } from "../config/event-bus";
import NotificationService from "../socket/notification.service";
import { PaginatedResponseDto } from "../types/common";
import {
  CreateProductDto,
  PatchProductDto,
  ProductDto,
  SimpleProductDto,
  ProductWithLikeDto,
} from "../types/product";

const getProductList = async (
  offset = 0,
  limit = 10,
  orderBy: "asc" | "desc" = "desc",
  keyword: string = ""
): Promise<PaginatedResponseDto<SimpleProductDto>> => {
  return productRepository.getProductList(offset, limit, orderBy, keyword);
};

const getProduct = async (id: string): Promise<ProductDto> => {
  return productRepository.getProduct(id);
};

const createProduct = async (data: CreateProductDto): Promise<ProductDto> => {
  return productRepository.createProduct(data);
};

const patchProduct = async (id: string, data: PatchProductDto): Promise<ProductDto> => {
  const oldProduct = await getProduct(id);
  const product = await productRepository.patchProduct(id, data);
  if (product.price !== oldProduct.price) {
    const userList = await getProductLikeUserList(id);
    userList.forEach(async (user) => {
      const notification = await NotificationService.createNotification({
        userId: user.userId,
        type: "LIKE",
        message: `상품 ${oldProduct.name}의 가격이 ${oldProduct.price}에서 ${product.price}로 변경되었습니다.`,
      });
      eventBus.emit("newNotification", notification);
    });
  }
  return product;
};

const deleteProduct = async (id: string): Promise<boolean> => {
  return productRepository.deleteProduct(id);
};

const likeProduct = async (
  userId: string,
  productId: string
): Promise<void> => {
  return productRepository.likeProduct(userId, productId);
};

const unlikeProduct = async (
  userId: string,
  productId: string
): Promise<void> => {
  return productRepository.unlikeProduct(userId, productId);
};

const getProductWithLike = async (
  userId: string,
  productId: string
): Promise<ProductWithLikeDto> => {
  return productRepository.getProductWithLike(userId, productId);
};

const getUserRegisteredProducts = async (
  userId: string
): Promise<ProductDto[]> => {
  return productRepository.getUserRegisteredProducts(userId);
};

const getProductLikeUserList = async (
  productId: string
): Promise<{ userId: string }[]> => {
  const likeUsers = await productRepository.getProductLikeUserList(productId);
  return likeUsers;
};

export default {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  getProductWithLike,
  getUserRegisteredProducts,
  getProductLikeUserList,
};
