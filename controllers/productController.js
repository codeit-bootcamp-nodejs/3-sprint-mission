import { findComments, createComment, updateComment, deleteComment, findProducts, createProduct, findProductById, updatdProduct, deleteProduct, updateLikeProduct, findLikedProducts } from '../services/productServices.js'

const productController = {
    getComments: async (req, res) => {

        const { cursor, limit = 10 } = req.query;
        const comments = await findComments(limit, cursor);

        let nextCursor = null
        if (comments.length) {
            nextCursor = comments[comments.length - 1].id
        }

        res.status(201).json({ data: comments, nextCursor })
    },

    postComment: async (req, res) => {

        const commentBody = {
            content: req.body.content,
            productId: req.body.id,
            userId: req.user.userId
        }

        const comment = await createComment(commentBody);

        res.status(201).json(comment)
    },

    patchComment: async (req, res) => {
        const id = req.params.id;

        const commentBody = {
            content: req.body.content,
        }

        const comment = await updateComment(commentBody, id);
        res.json(comment)
    },

    deleteComment: async (req, res) => {
        const id = req.params.id;
        await deleteComment(id);
        res.sendStatus(204)
    },

    getProducts: async (req, res) => {
        const { page = 1, limit = 10, order = 'recent', keyword = "" } = req.query
        const products = await findProducts(page, limit, order, keyword);

        res.send(products)
    },

    postProduct: async (req, res) => {
        req.body.userId = req.user.userId;
        const product = await createProduct(req);
        res.status(201).json(product)
    },

    getProductById: async (req, res) => {
        const { id } = req.params
        const userId = req.user.userId
        const product = await findProductById(id, userId);
        res.json(product)
    },

    patchProduct: async (req, res) => {
        const id = req.params.id;

        const product = await updatdProduct(req, id);
        res.json(product)
    },

    deleteProduct: async (req, res) => {
        const id = req.params.id;
        await deleteProduct(id);
        res.sendStatus(204)
    },

    likeProduct: async (req, res) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const product = await updateLikeProduct(id, userId)
        res.json(product)
    },

    getLikedProducts: async (req, res) => {
        const { page = 1, limit = 10, order = 'recent', keyword = "" } = req.query
        const userId = req.user.userId;
        const products = await findLikedProducts(page, limit, order, keyword, userId);
        res.json(products)
    },
}

export default productController