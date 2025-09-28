import { Request, Response, NextFunction } from 'express';
import {
    findComments, createComment, updateComment, deleteComment,
    findProducts, createProduct, findProductById, updateProduct,
    deleteProduct, updateLikeProduct, findLikedProducts
} from '../services/productServices';
import {
    CreateProductDto, UpdateProductDto,
    CreateProductCommentDto, UpdateProductCommentDto
} from '../types/product'

const productController = {
    getComments: async (req: Request, res: Response, next: NextFunction) => {
        const { cursor } = req.query;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const comments = await findComments(limit, cursor as string);

        let nextCursor: string | null = null;
        if (comments.length === limit) {
            nextCursor = comments[comments.length - 1].id;
        }

        res.status(200).json({ data: comments, nextCursor });
    },

    postComment: async (req: Request, res: Response, next: NextFunction) => {
        const commentBody: CreateProductCommentDto = {
            content: req.body.content as string,
            productId: req.body.id as string,
            userId: req.user?.userId as number
        };

        const comment = await createComment(commentBody);
        res.status(201).json(comment);
    },

    patchComment: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const commentBody: UpdateProductCommentDto = {
            content: req.body.content,
        };
        const comment = await updateComment(commentBody, id);
        res.json(comment);
    },

    deleteComment: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        await deleteComment(id);
        res.sendStatus(204);
    },

    getProducts: async (req: Request, res: Response, next: NextFunction) => {
        const { page, limit, order = 'recent', keyword = "" } = req.query;
        const products = await findProducts(page as string, limit as string, order as string, keyword as string);
        res.send(products);
    },

    postProduct: async (req: Request, res: Response, next: NextFunction) => {
        const productDto: CreateProductDto = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            tags: req.body.tags,
            userId: req.user?.userId ? req.user.userId : null
        }
        const product = await createProduct(productDto);
        res.status(201).json(product);
    },

    getProductById: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = req.user?.userId;
        const product = await findProductById(id, userId); // likedUser where 문의 userId가 들어가는데 이거 결과가 어떻게 나오는지 확인 필요
        res.json(product);
    },

    patchProduct: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const patchProductDto: UpdateProductDto = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            tags: req.body.tags
        }
        const product = await updateProduct(patchProductDto, id);
        res.json(product);
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        await deleteProduct(id);
        res.sendStatus(204);
    },

    likeProduct: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const userId = req.user!.userId; //likeProduct는 auth 다음에만 호출되니 ! 사용
        const product = await updateLikeProduct(id, userId);
        res.json(product);
    },

    getLikedProducts: async (req: Request, res: Response, next: NextFunction) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const { order = 'recent' } = req.query;
        const userId = req.user!.userId;
        const products = await findLikedProducts(page, limit, order as string, userId);
        res.json(products);
    },
};

export default productController;