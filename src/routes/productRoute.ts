import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/productController'
import { deleteProductComment, getProductCommentList, patchProductComment, postProductComment } from '../controllers/commentController'
import { validateProduct } from '../middlewares/validation'
import auth from '../middlewares/auth'

const productRouter = express.Router()

productRouter.route('/')
  .get(getProductList)
  .post(auth.verifyAccessToken, validateProduct, postProduct)

productRouter.route('/:id')
  .get(getProduct)
  .patch(auth.verifyAccessToken, auth.verifyProductAuthorid, validateProduct, patchProduct)
  .delete(auth.verifyAccessToken, auth.verifyProductAuthorid, deleteProduct)

productRouter.route('/:id/comments')
  .post(auth.verifyAccessToken, postProductComment)
  .get(getProductCommentList)

productRouter.route('/:id/comments/:commentId')
  .patch(auth.verifyAccessToken, patchProductComment)
  .delete(auth.verifyAccessToken, deleteProductComment)
export default productRouter