import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/productController.js'
import { deleteProductComment, getProductCommentList, patchProductComment, postProductComment } from '../controllers/commentController.js'
import { validateProduct } from '../middlewares/validation.js'
import auth from '../middlewares/auth.js'

const productRouter = express.Router()

productRouter.route('/')
  .get(getProductList)
  .post(auth.verifyAccessToken, validateProduct, postProduct)

productRouter.route('/:id')
  .get(getProduct)
  .patch(validateProduct, patchProduct)
  .delete(deleteProduct)

productRouter.route('/:id/comments')
  .post(auth.verifyAccessToken, postProductComment)
  .get(getProductCommentList)

productRouter.route('/:id/comments/:commentId')
  .patch(patchProductComment)
  .delete(deleteProductComment)
export default productRouter