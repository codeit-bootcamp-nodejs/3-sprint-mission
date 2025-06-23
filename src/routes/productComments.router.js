import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  validate,
  createProductCommentSchema,
  updateProductCommentSchema,
  deleteProductCommentSchema,
  getProductByIdSchema,
  updateProductCommentParamsSchema
} from '../middlewares/validation.middleware.js';
import { createProductComment, findAllProductComments, updateProductComment, deleteProductComment } from '../services/productComments.service.js';

const productCommentRouter = express.Router({ mergeParams: true });

productCommentRouter.route('/')
  .post(
    validate(getProductByIdSchema, 'params'),
    validate(createProductCommentSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { productsId } = req.params;
      const { content, usersId } = req.body;

      const newComment = await createProductComment({ productsId, usersId, content });

      res.status(201).json({
        message: '댓글이 저장되었습니다',
        data: newComment
      });
    })
  )
  .get(
    validate(getProductByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { productsId } = req.params;
      const { cursor, limit } = req.query;
      const { comments, nextCursor } = await findAllProductComments({ productsId, cursor, limit });
      res.status(200).json({
        message: '요청하신 상품 댓글목록 입니다',
        data: comments,
        nextCursor
      });
    })
  );

productCommentRouter.route('/:id')
  .patch(
    validate(updateProductCommentParamsSchema, 'params'),
    validate(updateProductCommentSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { id: commentId } = req.params;
      const { content, usersId } = req.body;

      const updatedComment = await updateProductComment(commentId, { content, usersId });

      res.status(200).json({
        message: '상품 댓글이 성공적으로 수정되었습니다.',
        data: updatedComment
      });
    })
  )
  .delete(
    validate(updateProductCommentParamsSchema, 'params'),
    validate(deleteProductCommentSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { id: commentId } = req.params;
      const { usersId } = req.body;
      const deletedComment = await deleteProductComment(commentId, usersId);
      res.status(204).end();
    })
  );

export default productCommentRouter;