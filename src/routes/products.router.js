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
  getByIdSchema,
  updateProductSchema
} from '../middlewares/validation.middleware.js';

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
    validate(createProductSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { name, description, price, isSold, tags, stock, usersId } = req.body;

      const newProduct = await createProduct({ name, description, price, isSold, tags, stock, usersId });

      res.status(201).json({
        message: '상품 등록 완료',
        data: newProduct,
      });
    })
  );

productRouter.route('/:id')
  .get(
    validate(getByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;

      const product = await findProductById(id);

      res.status(200).json({
        message: '상품 상세 조회',
        data: product,
      });
    })
  )
  .patch(
    validate(getByIdSchema, 'params'),
    validate(updateProductSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProduct = await updateProduct(id, updateData);

      res.status(200).json({
        message: '상품 수정을 성공하였습니다',
        data: updatedProduct,
      });
    })
  )
  .delete(
    validate(getByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await deleteProduct(id);
      res.status(204).end();
    })
  );

export default productRouter;