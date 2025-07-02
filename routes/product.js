import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/product.controller.js'
import { deleteProductComment, getProductCommentList, patchProductComment, postProductComment } from '../controllers/comment.controller.js'
import { validateProduct } from '../middlewares/validation.js'

const productRouter = express.Router()

productRouter.route('/')
  .get(getProductList)
  .post(validateProduct, postProduct)

productRouter.route('/:id')
  .get(getProduct)
  .patch(validateProduct, patchProduct)
  .delete(deleteProduct)

productRouter.route('/:id/comments')
  .post(postProductComment)
  .get(getProductCommentList)

productRouter.route('/:id/comments/:commentId')
  .patch(patchProductComment)
  .delete(deleteProductComment)
export default productRouter