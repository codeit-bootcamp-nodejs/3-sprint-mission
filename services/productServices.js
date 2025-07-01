import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function findProductById(id) {
    return await prisma.product.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true,
            },
        })
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
export { findComments, createComment, updateComment, deleteComment, findProducts, createProduct, findProductById, updatdProduct, deleteProduct };