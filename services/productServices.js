import { prisma } from '../config/prismaClient.js';
import productRepository from '../repositories/productRepository.js';

async function findComments(limit, cursor) {
    return await prisma.productComment.findMany({
        take: parseInt(limit),
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc', // 정렬 조건은 상황에 맞게
        },
        skip: cursor ? 1 : 0, // 커서가 있을 때는 현재 커서 이후 데이터부터
        ...(cursor && {
            cursor: {
                id: cursor,
            },
        }),
    })
}

async function createComment(commentBody) {
    return await prisma.productComment.create({
        data: commentBody
    })
}

async function updateComment(commentBody, id) {
    return await prisma.productComment.update({
        data: commentBody,
        where: { id },
    })
}

async function deleteComment(id) {
    await prisma.productComment.delete({
        where: { id },
    })
}

async function findProducts(page, limit, order, keyword) {
    return await prisma.product.findMany({
        skip: parseInt((page - 1) * limit),
        take: parseInt(limit),
        orderBy: {
            createdAt: order === 'recent' ? 'desc' : 'asc'
        },
        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
        },
        where: {
            OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
            ]
        }
    })
}

async function createProduct(req) {
    return await prisma.product.create({
        data: req.body
    })
}

async function findProductById(id, userId) {
    const product = await prisma.product.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            createdAt: true,
            likedUser: {
                where: { id: userId }
            }
        },
    })
    const { likedUser, ...productDetails } = product
    const isLiked = likedUser.length > 0;

    return { ...productDetails, isLiked };
}

async function updatdProduct(req, id) {
    return prisma.product.update({
        data: req.body,
        where: { id },
    })
}

async function deleteProduct(id) {
    await prisma.product.delete({
        where: { id },
    })
}

async function updateLikeProduct(id, userId) {
    const isLiked = await productRepository.checkLikeProduct(id, userId)
    let product;
    if (!isLiked) {
        product = await productRepository.likeProduct(id, userId);
    }
    else {
        product = await productRepository.unlikeProduct(id, userId);
    }
    product.isLiked = !isLiked; // 선택되어 있는지 체크해서 필드 추가, 반전시키는건 isLiked가 반영되기 전에 값이기 때문
    return product;
}

async function findLikedProducts(page, limit, order, keyword, userId) {
    // 검색 조건 구성
    const where = {
        likedUser: {
            some: {
                id: userId,
            },
        },
    };

    // 키워드 검색어가 있는 경우, AND 조건으로 추가
    if (keyword) {
        where.AND = [
            { ...where }, 
            {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            },
        ];
        // 중복을 피하기 위해 원래의 likedUser 조건은 삭제
        delete where.likedUser; 
    }

    return await prisma.product.findMany({
        where,
        skip: parseInt((page - 1) * limit),
        take: parseInt(limit),
        orderBy: {
            createdAt: order === 'recent' ? 'desc' : 'asc'
        },
        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
        },
    });
}

export { findComments, createComment, updateComment, deleteComment, findProducts, createProduct, findProductById, updatdProduct, deleteProduct, updateLikeProduct, findLikedProducts };

