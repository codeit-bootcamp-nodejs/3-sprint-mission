import { Article, ArticleComment } from '@prisma/client';
import { prisma } from '../config/prismaClient.js';
import { CreateArticleCommentDto, CreateArticleDto, UpdateArticleCommentDto, UpdateArticleDto } from '../../types/article.js';

class articleRepository {
    create = async (ArticleDto: CreateArticleDto) => {
        return await prisma.article.create({
            data: ArticleDto
        })
    }

    update = async (ArticleDto: UpdateArticleDto, id: string) => {
        return prisma.article.update({
            data: ArticleDto,
            where: { id },
        })
    }

    delete = async (id: string) => {
        await prisma.article.delete({
            where: { id },
        })
    }

    getById = async (id: string): Promise<Article | null> => {
        const article = await prisma.article.findUnique({
            where: {
                id,
            },
        })
        return article;
    }

    getByIdWithLiked = async (id: string, userId: number | undefined) => {
        return await prisma.article.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                likedUser: {
                    where: { id: userId }
                }
            },
        })
    }

    getList = async (page: number, limit: number, order: string, keyword: string) => {
        return await prisma.article.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: order === 'recent' ? 'desc' : 'asc'
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            where: {
                OR: [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                ]
            }
        })
    }

    createComment = async (createArticleCommentBody: CreateArticleCommentDto) => {
        return await prisma.articleComment.create({
            data: createArticleCommentBody
        })
    }

    updateComment = async (updateCommentBody: UpdateArticleCommentDto, id: string) => {
        return await prisma.articleComment.update({
            data: updateCommentBody,
            where: { id },
        })
    }

    deleteComment = async (id: string) => {
        await prisma.articleComment.delete({
            where: { id },
        })
    }

    getCommentById = async (id: string): Promise<ArticleComment | null> => {
        const articleComment = await prisma.articleComment.findUnique({
            where: {
                id,
            },
        })
        return articleComment;
    }
    
    getCommentList = async (limit: number, cursor: string) => {
        return await prisma.articleComment.findMany({
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
    checkLikeArticle = async (id: string, userId: number): Promise<boolean> => {
        const article = await prisma.article.findUniqueOrThrow({
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

    likeArticle = async (id: string, userId: number): Promise<Article> => {
        const article: Article = await prisma.article.update({
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

    unlikeArticle = async (id: string, userId: number): Promise<Article> => {
        const article: Article = await prisma.article.update({
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
