import { prisma } from '../config/prismaClient.js';

class productRepository {
    getById = async (id) => {
        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        })
        return product;
    }

    getCommentById = async (id) => {
        const productComment = await prisma.productComment.findUnique({
            where: {
                id,
            },
        })
        return productComment;
    }

    // 좋아요 브릿지 테이블에 없으면 false 반환
    checkLikeProduct = async (id, userId) => {
        const product = await prisma.product.findUnique({
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

    likeProduct = async (id, userId) => {
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

    unlikeProduct = async (id, userId) => {
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
}
export default new productRepository();
