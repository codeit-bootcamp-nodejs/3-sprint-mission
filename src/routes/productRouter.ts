import express from "express";
import { ProductTag } from '@prisma/client';
import uploadImage from '../middlewares/uploadMiddleware.js';
import path from 'path';
import asyncHandler from "../utils/asyncHandler.js";
import { convertProductUploadFields } from '../utils/uploadDataConverter.js';
import {
  verifyAccessToken,
  optionalVerifyAccessToken,
} from '../middlewares/auth.js';
import {
  findAllProducts,
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
  toggleProductLike,
} from "../services/productService.js";
import {
  validate,
  createProductSchema,
  getProductByIdSchema,
  updateProductSchema,
} from '../middlewares/validationMiddleware.js';

const productRouter = express.Router();

productRouter.route('/')
  .get(asyncHandler(async (req, res, next) => {
    const products = await findAllProducts(req.query);
    res.status(200).json({
      message: '상품 목록 조회',
      data: products,
    });
  }))
  .post(
    verifyAccessToken,
    (req, res, next) => {
      req.uploadPath = path.resolve(process.cwd(), 'uploads/products');
      next();
    },
    uploadImage.single('image'),
    convertProductUploadFields,
    validate(createProductSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const imageUrl = req.file ? req.file.path : null;
      const { name, description, price, isSold, tags, stock } = req.body as {
        name: string;
        description?: string;
        price: number;
        userId: string;
        isSold?: boolean;
        tags?: ProductTag[];
        stock?: number;
        imageUrl?: string | null
      };
      const userId = req.user!.userId;

      const newProduct = await createProduct({
        name,
        description,
        price,
        isSold,
        tags,
        stock,
        userId,
        imageUrl
      });
      res.status(201).json({
        message: '상품 등록 완료',
        data: newProduct,
      });
    })
  );

productRouter.route('/:productId')
  .get(
    optionalVerifyAccessToken,
    validate(getProductByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const currentUserId = req.user?.userId
      const product = await findProductById(productId, currentUserId);
      res.status(200).json({
        message: '상품 상세 조회',
        data: product,
      });
    })
  )
  .patch(
    verifyAccessToken,
    (req, res, next) => {
      req.uploadPath = path.resolve(process.cwd(), 'uploads/products');
      next();
    },
    uploadImage.single('image'),
    convertProductUploadFields,
    validate(getProductByIdSchema, 'params'),
    validate(updateProductSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const imageUrl = req.file ? req.file.path : undefined;
      const loggedInUserId = req.user!.userId;
      const updateData = req.body;

      if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl;
      } else if (req.body.imageUrl !== undefined) {
        updateData.imageUrl = req.body.imageUrl;
      }

      const updatedProduct = await updateProduct(productId, loggedInUserId, updateData);

      res.status(200).json({
        message: '상품 수정을 성공하였습니다',
        data: updatedProduct,
      });
    })
  )
  .delete(
    verifyAccessToken,
    validate(getProductByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const loggedInUserId = req.user!.userId;
      await deleteProduct(productId, loggedInUserId);
      res.status(204).end();
    })
  );

productRouter.route('/:productId/like')
  .post(
    verifyAccessToken,
    validate(getProductByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const loggedInUserId = req.user!.userId;
      const result = await toggleProductLike(productId, loggedInUserId);
      res.status(200).json(result)
    })
  );


export default productRouter;