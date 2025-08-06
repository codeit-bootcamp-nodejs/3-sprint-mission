import articleRepository from '../repositories/articleRepository.js';
import {
    CreateArticleCommentDto, UpdateArticleCommentDto,
    CreateArticleDto, UpdateArticleDto,
    likedArticle,
} from '../../types/article.js';
import { Article } from '@prisma/client';


async function findComments(limit: string, cursor: string) {
    const commentList = await articleRepository.getCommentList(parseInt(limit), cursor);
    return commentList;
}

async function createComment(commentBody: CreateArticleCommentDto) {
    const comment = await articleRepository.createComment(commentBody);
    return comment;
}

async function updateComment(commentBody: UpdateArticleCommentDto, id: string) {
    const comment = await articleRepository.updateComment(commentBody, id);
    return comment;
}

async function deleteComment(id: string) {
    await articleRepository.deleteComment(id);
}

async function findArticles(page: string, limit: string, order: string, keyword: string) {
    const articleList = await articleRepository.getList(parseInt(page), parseInt(limit), order, keyword);
    return articleList;
}

async function createArticle(createArticleBody: CreateArticleDto): Promise<Article> {
    const article = await articleRepository.create(createArticleBody);
    return article;
}

async function findArticleById(id: string, userId: number | undefined) {
    const article = await articleRepository.getByIdWithLiked(id, userId);
    const { likedUser, ...articleDetails } = article
    const isLiked = likedUser.length > 0;
    return { ...articleDetails, isLiked };
}

async function updatdArticle(updateArticleBody: UpdateArticleDto, id: string) {
    const article = await articleRepository.update(updateArticleBody, id);
    return article;
}

async function deleteArticle(id: string) {
    await articleRepository.delete(id);
}

async function updateLikeArticle(id: string, userId: number): Promise<likedArticle> {
    const isLiked: boolean = await articleRepository.checkLikeArticle(id, userId)
    let article: Article;
    if (!isLiked) {
        article = await articleRepository.likeArticle(id, userId);
    }
    else {
        article = await articleRepository.unlikeArticle(id, userId);
    }

    const likedArticle: likedArticle = {
        ...article,
        isLiked: !isLiked
    } // 선택되어 있는지 체크해서 필드 추가, 반전시키는건 isLiked가 반영되기 전에 값이기 때문
    return likedArticle;
}

export { findComments, createComment, updateComment, deleteComment, findArticles, createArticle, findArticleById, updatdArticle, deleteArticle, updateLikeArticle };