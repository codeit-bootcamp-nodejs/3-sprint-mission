import { prisma } from '../config/prismaClient.js';
import {
    CreateProductDto, UpdateProductDto,
    CreateProductCommentDto, UpdateProductCommentDto
} from '../types/product.js'

class productRepository {

    create = async (productDto: CreateProductDto) => {
        return await prisma.product.create({
            data: productDto
        })
    }

    update = async (productDto: UpdateProductDto, id: string) => {
        return await prisma.product.update({
            data: productDto,
            where: { id },
        })
    }

    delete = async (id: string) => {
        await prisma.product.delete({
            where: { id },
        })
    }

    getById = async (id: string) => {
        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        })
        return product;
    }

    getByIdWithLiked = async (id: string, userId: number | undefined) => {
        return await prisma.product.findUniqueOrThrow({
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
    }

    getList = async (page: number, limit: number, order: string, keyword: string) => {
        return await prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
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

    getLikedList = async (page: number, limit: number, order: string, userId: number) => {
        return await prisma.product.findMany({
            where: {
                likedUser: {
                    some: {
                        id: userId,
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
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

    createComment = async (createProductCommentBody: CreateProductCommentDto) => {
        return await prisma.productComment.create({
            data: createProductCommentBody
        })
    }

    updateComment = async (updateCommentBody: UpdateProductCommentDto, id: string) => {
        return await prisma.productComment.update({
            data: updateCommentBody,
            where: { id },
        })
    }

    deleteComment = async (id: string) => {
        await prisma.productComment.delete({
            where: { id },
        })
    }

    getCommentById = async (id: string) => {
        const productComment = await prisma.productComment.findUnique({
            where: {
                id,
            },
        })
        return productComment;
    }

    getCommentList = async (limit: number, cursor: string) => {
        return await prisma.productComment.findMany({
            take: limit,
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

    // 좋아요 브릿지 테이블에 없으면 false 반환
    checkLikeProduct = async (id: string, userId: number): Promise<boolean> => {
        const product = await prisma.product.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                likedUser: {
                    where: { id: userId, }
                }
            }
        })
        // likedUser 배열의 길이가 0보다 크면 '좋아요'한 것으로 간주
        return product.likedUser.length > 0
    }

    likeProduct = async (id: string, userId: number) => {
        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                likedUser: {
                    connect: {
                        id: userId,
                    }
                }
            },
        })
        return product;
    }

    unlikeProduct = async (id: string, userId: number) => {
        const product = await prisma.product.update({
            where: {
                id,
            },
            data: {
                likedUser: {
                    disconnect: {
                        id: userId,
                    }
                }
            }
        })
        return product;
    }

    findLikedUsersByProductId = async (id: string) => {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                likedUser: true,
            },
        });
        return product?.likedUser;
    }
}
export default new productRepository();
