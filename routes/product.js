import express from 'express'
import { deleteProduct, getProduct, getProductList, patchProduct, postProduct } from '../controllers/product.controller.js'

const productRouter = express.Router()

productRouter.route('/')
  .get(getProductList)
  .post(postProduct)

productRouter.route('/:id')
  .get(getProduct)
  .patch(patchProduct)
  .delete(deleteProduct)

export default productRouter