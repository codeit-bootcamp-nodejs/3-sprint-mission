import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  validate,
  updateProductCommentParamsSchema,
  DeleteCommentBaseSchema,
  CommentBaseSchema,
  getProductByIdSchema,
  UpdateCommentBaseSchema,
} from '../middlewares/validation.middleware.js';
import { createProductComment, findAllProductComments, updateProductComment, deleteProductComment } from '../services/productComments.service.js';

const productCommentRouter = express.Router({ mergeParams: true });

productCommentRouter.route('/')
  .post(
    validate(getProductByIdSchema, 'params'),
    validate(CommentBaseSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const { content, userId } = req.body;

      const newComment = await createProductComment({ productId, userId, content });

      res.status(201).json({
        message: '댓글이 저장되었습니다',
        data: newComment
      });
    })
  )
  .get(
    validate(getProductByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { productId } = req.params;
      const { cursor, limit } = req.query;
      const { comments, nextCursor } = await findAllProductComments({ productId, cursor, limit });
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
    validate(UpdateCommentBaseSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { id: commentId } = req.params;
      const { content, userId } = req.body;

      const updatedComment = await updateProductComment(commentId, { content, userId });

      res.status(200).json({
        message: '상품 댓글이 성공적으로 수정되었습니다.',
        data: updatedComment
      });
    })
  )
  .delete(
    validate(updateProductCommentParamsSchema, 'params'),
    validate(DeleteCommentBaseSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { id: commentId } = req.params;
      const { userId } = req.body;
      const deletedComment = await deleteProductComment(commentId, userId);
      res.status(204).end();
    })
  );

export default productCommentRouter;