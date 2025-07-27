import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/productController.js'
import { deleteProductComment, getProductCommentList, patchProductComment, postProductComment } from '../controllers/commentController.js'
import { validateProduct } from '../middlewares/validation.js'
import auth from '../middlewares/auth.js'

const productRouter = express.Router()

productRouter.route('/')
  .get(getProductList)
  .post(verifyAccessToken, auth.verifyAccessToken, validateProduct, postProduct)

productRouter.route('/:id')
  .get(getProduct)
  .patch(verifyAccessToken, auth.verifyProductAuthorid, validateProduct, patchProduct)
  .delete(verifyAccessToken, auth.verifyProductAuthorid, deleteProduct)

productRouter.route('/:id/comments')
  .post(verifyAccessToken, auth.verifyAccessToken, postProductComment)
  .get(getProductCommentList)

productRouter.route('/:id/comments/:commentId')
  .patch(verifyAccessToken, patchProductComment)
  .delete(verifyAccessToken, deleteProductComment)
export default productRouter