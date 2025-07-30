import { findComments, createComment, updateComment, deleteComment, findArticles, createArticle, findArticleById, updatdArticle, deleteArticle, updateLikeArticle } from '../services/articleServices.js';

const articleController = {
    
    getComments : async (req, res) => { 
        const { cursor, limit = 10 } = req.query;
        const comments = await findComments(limit, cursor)

        let nextCursor = null
        if (comments.length) {
            nextCursor = comments[comments.length - 1].id
        }

        res.status(201).json({ data: comments, nextCursor })
    },

    postComment : async (req, res) => { 
        const commentBody = {
            content: req.body.content,
            articleId: req.body.id,
            userId: req.user.userId
        }
        const comment = await createComment(commentBody)

        res.status(201).json(comment)
    },

    patchComment : async (req, res) => {
        const id = req.params.id;
        const commentBody = {
            content: req.body.content,
        }
        const comment = await updateComment(commentBody, id)
        res.json(comment)
    },

    deleteComment : async (req, res) => {
        const id = req.params.id;
        await deleteComment(id);
        res.sendStatus(204)
    },

    getArticles : async (req, res) => {
        const { page = 1, limit = 10, order = 'recent', keyword = "" } = req.query
        const articles = await findArticles(page, limit, order, keyword)

        res.send(articles)
    },

    postArticle : async (req, res) => {
        req.body.userId = req.user.userId;
        const article = await createArticle(req);
        res.status(201).json(article)
    },

    getArticleById : async (req, res) => {
        const { id } = req.params
        const userId = req.user.userId
        const article = await findArticleById(id, userId);
        res.send(article)
    },

    patchArticle : async (req, res) => {
        const id = req.params.id;

        const article = await updatdArticle(req, id);
        res.json(article)
    },

    deleteArticle : async (req, res) => {
        const id = req.params.id;
        await deleteArticle(id);
        res.sendStatus(204)
    },

    likeArticle : async (req, res) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const article = await updateLikeArticle(id, userId)
        res.json(article)
    },
}

export default articleController