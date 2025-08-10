import * as productRepository from '../repositories/productRepository';
import {
  CreateProductData,
  UpdateProductData,
  ProductWithDetails
} from '../../types/product';
import {
  PrismaFindManyArgs,
  PaginationAndSearchRequest
} from '../../types/pagenation';
import { processFindManyArgs, processResponse } from '../utils/responseHelpers';
import { checkProductOwnership } from '../utils/queryHelpers';

// 상품 목록을 조회하는 서비스 (페이지네이션, 정렬, 검색 포함)
export const findAllProducts = async (query: PaginationAndSearchRequest['query']) => {
  const params: PrismaFindManyArgs = processFindManyArgs(query, 'product');

  const products: ProductWithDetails[] = await productRepository.findAllProductsWithDetailsRp(params);

  return products.map(product => processResponse(product, 'ProductLike'));
};

// 새로운 상품을 생성하는 서비스
export const createProduct = async (productData: CreateProductData) => {
  const newProduct = await productRepository.createProductRp(productData);

  return processResponse(newProduct, 'ProductLike');
};

// 특정 ID의 상품 상세 정보를 조회하는 서비스
export const findProductById = async (
  productId: string,
  currentUserId?: string | null
) => {
  const product = await productRepository.findProductByIdRp(productId);

  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  let isLiked = false;
  if (currentUserId) {
    const existingLike = await productRepository.findUniqueProductLikeRp(
      currentUserId,
      productId
    );
    isLiked = !!existingLike;
  }

  const productWithDetails: ProductWithDetails = { ...product, isLiked };
  return processResponse(productWithDetails, 'ProductLike');
};

// 상품 정보를 수정하는 서비스
export const updateProduct = async (
  productId: string,
  userId: string,
  updateData: UpdateProductData
) => {
  await checkProductOwnership(productId, userId);

  const updatedProduct = await productRepository.updateProductRp(
    productId,
    updateData
  );

  return processResponse(updatedProduct, 'ProductLike');
};

// 상품을 삭제하는 서비스
export const deleteProduct = async (productId: string, userId: string) => {
  await checkProductOwnership(productId, userId);

  const deletedProduct = await productRepository.deleteProductRp(productId);
  return deletedProduct;
};

// 좋아요를 토글하는 서비스
export const toggleProductLike = async (productId: string, userId: string) => {
  const existingLike = await productRepository.findUniqueProductLikeRp(
    userId,
    productId
  );

  if (existingLike) {
    await productRepository.deleteProductLikeRp(existingLike.id);
    return { liked: false, message: '좋아요를 취소하였습니다' };
  } else {
    await productRepository.createProductLikeRp(userId, productId);
    return { liked: true, message: '좋아요가 추가되었습니다' };
  }
};

// 좋아요한 상품 조회
export const findLikedProductByUserId = async (userId: string) => {
  const likedProducts = await productRepository.findLikedProductRp(userId)
  if (likedProducts.length === 0) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  const products = likedProducts.map(like => like.product);
  return products;
}
