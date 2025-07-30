import { prisma } from '../config/prismaClient.js';
import articleRepository from '../repositories/articleRepository.js';

async function findComments(limit, cursor) {
    return await prisma.articleComment.findMany({
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
    return await prisma.articleComment.create({
        data: commentBody
    })
}

async function updateComment(commentBody, id) {
    return await prisma.articleComment.update({
        data: commentBody,
        where: { id },
    })
}

async function deleteComment(id) {
    await prisma.articleComment.delete({
        where: { id },
    })
}

async function findArticles(page, limit, order, keyword) {
    return await prisma.article.findMany({
        skip: parseInt((page - 1) * limit),
        take: parseInt(limit),
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

async function createArticle(req) {
    return await prisma.article.create({
        data: req.body
    })
}

async function findArticleById(id, userId) {
    const article = await prisma.article.findUniqueOrThrow({
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
    const { likedUser, ...articleDetails } = article
    const isLiked = likedUser.length > 0;
    return { ...articleDetails, isLiked };
}

async function updatdArticle(req, id) {
    return await prisma.article.update({
        data: req.body,
        where: { id },
    })
}

async function deleteArticle(id) {
    await prisma.article.delete({
        where: { id },
    })
}

async function updateLikeArticle(id, userId) {
    const isLiked = await articleRepository.checkLikeArticle(id, userId)
    let article;
    if (!isLiked) {
        article = await articleRepository.likeArticle(id, userId);
    }
    else {
        article = await articleRepository.unlikeArticle(id, userId);
    }
    article.isLiked = !isLiked; // 선택되어 있는지 체크해서 필드 추가, 반전시키는건 isLiked가 반영되기 전에 값이기 때문
    return article;
}

export { findComments, createComment, updateComment, deleteComment, findArticles, createArticle, findArticleById, updatdArticle, deleteArticle, updateLikeArticle };