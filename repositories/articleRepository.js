import { prisma } from '../config/prismaClient.js';

class articleRepository {
    getById = async (id) => {
        const article = await prisma.article.findUnique({
            where: {
                id,
            },
        })
        return article;
    }

    getCommentById = async (id) => {
        const articleComment = await prisma.articleComment.findUnique({
            where: {
                id,
            },
        })
        return articleComment;
    }
        // 좋아요 브릿지 테이블에 없으면 false 반환
    checkLikeArticle = async (id, userId) => {
        const article = await prisma.article.findUnique({
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
        return article.likedUser.length > 0
    }

    likeArticle = async (id, userId) => {
        const article = await prisma.article.update({
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
        return article;
    }

    unlikeArticle = async (id, userId) => {
        const article = await prisma.article.update({
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
        return article;
    }
}

export default new articleRepository();
