
import express from "express";
import {
  findAllProducts,
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct
} from "../services/products.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  validate,
  createProductSchema,
  getProductByIdSchema,
  updateProductSchema,
  deleteProductSchema
} from '../middlewares/validation.middleware.js';
import uploadImage from '../middlewares/upload.middleware.js';
import path from 'path';
import { convertProductUploadFields } from '../utils/uploadDataConverter.js';

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
    (req, res, next) => {
      req.uploadPath = path.resolve(process.cwd(), 'uploads/products');
      next();
    },
    uploadImage.single('image'),
    convertProductUploadFields,
    validate(createProductSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const imageUrl = req.file ? req.file.path : null;
      const { name, description, price, isSold, tags, stock, userId } = req.body;

      const newProduct = await createProduct({ name, description, price, isSold, tags, stock, userId, imageUrl });

      res.status(201).json({
        message: '상품 등록 완료',
        data: newProduct,
      });
    })
  );

productRouter.route('/:productId')
  .get(
    validate(getProductByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;

      const product = await findProductById(productId);

      res.status(200).json({
        message: '상품 상세 조회',
        data: product,
      });
    })
  )
  .patch(
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

      const { userId, ...updateData } = req.body;

      const finalUpdateData = { ...updateData };
      if (imageUrl !== undefined) {
          finalUpdateData.imageUrl = imageUrl;
      } else if (req.body.imageUrl !== undefined) {
          finalUpdateData.imageUrl = req.body.imageUrl;
      }


      const updatedProduct = await updateProduct(productId, userId, finalUpdateData);

      res.status(200).json({
        message: '상품 수정을 성공하였습니다',
        data: updatedProduct,
      });
    })
  )
  .delete(
    validate(getProductByIdSchema, 'params'),
    validate(deleteProductSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const { userId } = req.body;
      await deleteProduct(productId, userId);
      res.status(204).end();
    })
  );

export default productRouter;