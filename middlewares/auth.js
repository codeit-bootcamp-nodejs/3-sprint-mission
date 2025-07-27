import { expressjwt } from "express-jwt"
import userRepository from "../repository/userRepository.js"
import { getProduct } from "../controllers/productController.js";
import { getArticle } from "../controllers/articleController.js";

const verifyAccessToken = expressjwt({
  secret: process.env.Jwt_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
})

const verifyProductAuthorid = async (req, res, next) => {
  const { id: productId } = req.params;
  try {
    const product = await getProduct(productId);

    if (!product) {
      const error = new Error('Product not found')
      error.code = 404;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error)
  }
}

const verifyArticleAuthorid = async (req, res, next) => {
  const { id: articleId } = req.params;
  try {
    const article = await getArticle(articleId);

    if (!article) {
      const error = new Error('Article not found')
      error.code = 404;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error)
  }
}

const verifyProductCommentAuthorid = async (req, res, next) => {
  const { id: commentId } = req.params;
  try {
    const comment = await getArticle(commentId);

    if (!comment) {
      const error = new Error('Comment not found')
      error.code = 404;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error)
  }
}

export default {
  verifyAccessToken,
  verifyProductAuthorid,
  verifyArticleAuthorid,
}