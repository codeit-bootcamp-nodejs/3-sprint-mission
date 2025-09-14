import { CustomError } from '../utils/CustomError.js';
import { CreateProductDto, UpdateProductDto, PublicProduct } from '../types/product.js';
import {
  findMany,
  findById,
  create,
  update,
  remove
} from '../repositories/productRepository.js';
import * as likeRepo from '../repositories/likeRepository.js';
import * as notificationService from '../notifications/notificationService.js';

export const getProductList = async (
  offset = 0,
  limit = 10,
  search = '',
  sort: 'asc' | 'desc' = 'desc'
): Promise<Pick<PublicProduct, 'id' | 'name' | 'price' | 'createdAt'>[]> => {
  return findMany(offset, limit, search, sort);
};

export const getProductById = async (id: number): Promise<PublicProduct> => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  const product = await findById(id);
  if (!product) throw new CustomError('해당 상품을 찾을 수 없습니다.', 404);

  return product;
};

export const createProduct = (data: CreateProductDto) => create(data);

export const updateProduct = async (
  id: number,
  userId: number,
  data: UpdateProductDto
) => {
  if (!Number.isInteger(id) || id <= 0)
    throw new CustomError("상품 ID가 올바르지 않습니다.", 400);

  const product = await findById(id);
  if (!product) throw new CustomError("상품을 찾을 수 없습니다.", 404);
  if (product.userId !== userId)
    throw new CustomError("해당 상품에 대한 수정 권한이 없습니다.", 403);

  const oldPrice = product.price;

  const updated = await update(id, data);

  /**
   * 1. 가격 변경 감지
   * 2. 찜한 사용자 목록 조회
   * 3. 각 사용자에게 알림 생성
   */
  const newPrice = updated.price ?? data.price ?? oldPrice;
  if (typeof newPrice === "number" && newPrice !== oldPrice) {
    const likers = await likeRepo.findUsersByProduct(id);
    for (const { userId: recipientUserId } of likers) {
      await notificationService.createPriceChange({
        recipientUserId,
        productId: id,
        oldPrice,
        newPrice,
      });
    }
  }

  return updated;
};

export const deleteProduct = async (id: number, userId: number) => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  const product = await findById(id);
  if (!product) throw new CustomError('상품을 찾을 수 없습니다.', 404);
  if (product.userId !== userId) throw new CustomError('해당 상품에 대한 삭제 권한이 없습니다.', 403);

  return remove(id);
};