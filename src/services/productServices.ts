import { Product, ProductComment } from '@prisma/client';
import productRepository from '../repositories/productRepository.js';
import {
    CreateProductDto, UpdateProductDto,
    CreateProductCommentDto, UpdateProductCommentDto,
    likedProduct
} from '../types/product.js'
import { createNotification } from './notificationService.js';

async function findComments(limit: number, cursor: string) {
    const commentList = await productRepository.getCommentList(limit, cursor);
    return commentList;
}

async function createComment(createProductCommentBody: CreateProductCommentDto) {
    const productComment: ProductComment = await productRepository.createComment(createProductCommentBody)
    return productComment;
}

async function updateComment(updateCommentBody: UpdateProductCommentDto, id: string) {
    const comment = await productRepository.updateComment(updateCommentBody, id);
    return comment;
}

async function deleteComment(id: string) {
    await productRepository.deleteComment(id);
}

async function findProducts(page: string = '1', limit: string = '10', order: string, keyword: string) {
    const productList = await productRepository.getList(parseInt(page), parseInt(limit), order, keyword);
    return productList;
}

async function createProduct(productDto: CreateProductDto) {
    const product = await productRepository.create(productDto);
    return product;
}

async function findProductById(id: string, userId: number | undefined) {
    const product = await productRepository.getByIdWithLiked(id, userId);
    const { likedUser, ...productDetails } = product;
    const isLiked = likedUser.length > 0;

    return { ...productDetails, isLiked };
}

async function updateProduct(productDto: UpdateProductDto, id: string) {
    const oldProduct = await productRepository.getById(id);
    const product = await productRepository.update(productDto, id);
    /**
     * 알람 전송 파트 : 좋아요를 누른 가격의 상품이 변동되면 좋아요한 사람들에게 전부 알람 전송
     */
    if (oldProduct?.price !== product.price) {
        const likedUsers = await productRepository.findLikedUsersByProductId(id);
        if (likedUsers) {
            const notificationPromises = likedUsers.map((user) => {
                return createNotification({
                    content: "좋아요를 누른 가격의 상품이 변동되었습니다",
                    userId: user.id
                });
            });
            await Promise.all(notificationPromises);
        }
    }
    return product;
}

async function deleteProduct(id: string) {
    await productRepository.delete(id);
}

async function updateLikeProduct(id: string, userId: number): Promise<likedProduct> {
    const isLiked: boolean = await productRepository.checkLikeProduct(id, userId)
    let product: Product;
    if (!isLiked) {
        product = await productRepository.likeProduct(id, userId);
    }
    else {
        product = await productRepository.unlikeProduct(id, userId);
    }

    const likedProduct: likedProduct = {
        ...product,
        isLiked: !isLiked
    } // 선택되어 있는지 체크해서 필드 추가, 반전시키는건 isLiked가 반영되기 전에 값이기 때문
    return likedProduct;
}

async function findLikedProducts(page: number, limit: number, order: string, userId: number) {
    const likedProductList = await productRepository.getLikedList(page, limit, order, userId);
    return likedProductList;
}

export { findComments, createComment, updateComment, deleteComment, findProducts, createProduct, findProductById, updateProduct, deleteProduct, updateLikeProduct, findLikedProducts };

