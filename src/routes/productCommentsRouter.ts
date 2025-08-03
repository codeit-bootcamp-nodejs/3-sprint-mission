import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../middlewares/auth.js';
import {
  validate,
  updateProductCommentParamsSchema,
  CommentBaseSchema,
  getProductByIdSchema,
  paginationQuerySchema,
} from '../middlewares/validationMiddleware.js';
import {
  createCommentController,
  getCommentsController,
  updateCommentController,
  deleteCommentController,
} from '../controllers/productCommentController.js';

const productCommentRouter = express.Router({ mergeParams: true });

// 상품 댓글 생성 및 목록 조회 라우트
productCommentRouter
  .route('/')
  .post(
    verifyAccessToken,
    validate(getProductByIdSchema, 'params'),
    validate(CommentBaseSchema, 'body'),
    asyncHandler(createCommentController)
  )
  .get(
    validate(paginationQuerySchema, 'query'),
    validate(getProductByIdSchema, 'params'),
    asyncHandler(getCommentsController)
  );

// 특정 댓글 수정 및 삭제 라우트
productCommentRouter
  .route('/:commentId')
  .patch(
    verifyAccessToken,
    validate(updateProductCommentParamsSchema, 'params'),
    validate(CommentBaseSchema, 'body'),
    asyncHandler(updateCommentController)
  )
  .delete(
    verifyAccessToken,
    validate(updateProductCommentParamsSchema, 'params'),
    asyncHandler(deleteCommentController)
  );

export default productCommentRouter;