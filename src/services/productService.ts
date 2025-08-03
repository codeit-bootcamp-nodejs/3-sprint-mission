import { CustomError } from '../utils/CustomError.js';
import { CreateProductDto, UpdateProductDto, PublicProduct } from '../types/product.js';
import {
  findMany,
  findById,
  create,
  update,
  remove
} from '../repositories/productRepository.js';

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

export const updateProduct = async (id: number, userId: number, data: UpdateProductDto) => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  const product = await findById(id);
  if (!product) throw new CustomError('상품을 찾을 수 없습니다.', 404);
  if (product.userId !== userId) throw new CustomError('해당 상품에 대한 수정 권한이 없습니다.', 403);

  return update(id, data);
};

export const deleteProduct = async (id: number, userId: number) => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('상품 ID가 올바르지 않습니다.', 400);

  const product = await findById(id);
  if (!product) throw new CustomError('상품을 찾을 수 없습니다.', 404);
  if (product.userId !== userId) throw new CustomError('해당 상품에 대한 삭제 권한이 없습니다.', 403);

  return remove(id);
};