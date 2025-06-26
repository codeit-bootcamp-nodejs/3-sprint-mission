import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/product.controller.js'
import { getProductCommentList, postProductComment } from '../controllers/comment.controller.js'

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

export default productRouter