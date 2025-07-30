import { expressjwt } from 'express-jwt'
import productRepository from '../repositories/productRepository.js'
import articleRepository from '../repositories/articleRepository.js'
import userRepository from '../repositories/userRepository.js'

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
})

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
})

const verifyProductAuth = async (req, res, next) => {
  const { id: productId } = req.params;
  try {
    const product = await productRepository.getById(productId);

    if (!product) {
      const error = new Error('Product not found');
      error.code = 404;
      throw error;
    }

    if (product.userId !== req.user.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

const verifyArticleAuth = async (req, res, next) => {
  const { id: articleId } = req.params;
  try {
    const article = await articleRepository.getById(articleId);

    if (!article) {
      const error = new Error('Article not found');
      error.code = 404;
      throw error;
    }

    if (article.userId !== req.user.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

const verifyProductCommentAuth = async (req, res, next) => {
  const { id: productCommentId } = req.params;
  try {
    const productComment = await productRepository.getCommentById(productCommentId);

    if (!productComment) {
      const error = new Error('Comment not found');
      error.code = 404;
      throw error;
    }

    if (productComment.userId !== req.user.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

const verifyArticleCommentAuth = async (req, res, next) => {
  const { id: articleCommentId } = req.params;
  try {
    const articleComment = await articleRepository.getCommentById(articleCommentId);

    if (!articleComment) {
      const error = new Error('Comment not found');
      error.code = 404;
      throw error;
    }

    if (articleComment.userId !== req.user.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 이미 로그인이 된 상태, 토큰에 있는 정보로 진행
 * 토큰은 유효하나 DB에는 제거해서 없을수도 있으므로 한번 검사 
 * */ 
const verifyUserAuth = async (req, res, next) => { 
  const userId = req.user.userId;
  try {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.code = 404;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default {
  verifyAccessToken, verifyRefreshToken,
  verifyProductAuth, verifyProductCommentAuth, 
  verifyArticleAuth, verifyArticleCommentAuth,
  verifyUserAuth,
}