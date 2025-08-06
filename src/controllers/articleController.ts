import { Article } from '@prisma/client';
import { CreateArticleDto, UpdateArticleDto } from '../../types/article.js';
import { findComments, createComment, updateComment, deleteComment, findArticles, createArticle, findArticleById, updatdArticle, deleteArticle, updateLikeArticle } from '../services/articleServices.js';
import { Request, Response, NextFunction } from 'express';

const articleController = {

    getComments: async (req: Request, res: Response): Promise<void> => {
        const { cursor } = req.query;
        const limit = req.query.limit ? req.query.limit as string : '10';
        const comments = await findComments(limit, cursor as string);

        let nextCursor: string | null = null
        if (comments.length) {
            nextCursor = comments[comments.length - 1].id
        }

        res.status(201).json({ data: comments, nextCursor })
    },

    postComment: async (req: Request, res: Response): Promise<void> => {
        const commentBody = {
            content: req.body.content,
            articleId: req.body.id,
            userId: req.user!.userId
        }
        const comment = await createComment(commentBody)

        res.status(201).json(comment)
    },

    patchComment: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const commentBody = {
            content: req.body.content,
        }
        const comment = await updateComment(commentBody, id)
        res.json(comment)
    },

    deleteComment: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        await deleteComment(id);
        res.sendStatus(204)
    },

    getArticles: async (req: Request, res: Response): Promise<void> => {
        const { page = 1, limit = 10, order = 'recent', keyword = "" } = req.query
        const articles = await findArticles(page as string, limit as string, order as string, keyword as string)

        res.send(articles)
    },

    postArticle: async (req: Request, res: Response): Promise<void> => {
        const articleDto: CreateArticleDto = {
            title: req.body.title,
            content: req.body.content,
            userId: req.user?.userId ? req.user.userId : null
        }
        const article: Article = await createArticle(articleDto);
        res.status(201).json(article)
    },

    getArticleById: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params
        const userId = req.user?.userId
        const article = await findArticleById(id, userId);
        res.send(article)
    },

    patchArticle: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const patchArticleDto: UpdateArticleDto = {
            title: req.body.title,
            content: req.body.content,
        }
        const article = await updatdArticle(patchArticleDto, id);
        res.json(article)
    },

    deleteArticle: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        await deleteArticle(id);
        res.sendStatus(204)
    },

    likeArticle: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const userId = req.user!.userId; //likeArticle은 auth 다음에만 호출되니 ! 사용
        const article = await updateLikeArticle(id, userId)
        res.json(article)
    },
}

export default articleController