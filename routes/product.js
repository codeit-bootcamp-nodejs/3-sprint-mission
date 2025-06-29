import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/product.controller.js'
import { deleteProductComment, getProductCommentList, patchProductComment, postProductComment } from '../controllers/comment.controller.js'

const productRouter = express.Router()

productRouter.route('/')
  .get(getProductList)
  .post(postProduct)

productRouter.route('/:id')
  .get(getProduct)
  .patch(patchProduct)
  .delete(deleteProduct)

productRouter.route('/:id/comments')
  .post(postProductComment)
  .get(getProductCommentList)

productRouter.route('/:id/comments/:commentId')
  .patch(patchProductComment)
  .delete(deleteProductComment)
export default productRouter