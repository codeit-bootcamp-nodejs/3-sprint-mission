import { expressjwt } from "express-jwt"
import userRepository from "../repository/userRepository"
import { getProduct } from "../controllers/productController";
import { getArticle } from "../controllers/articleController";
import { getComment } from "../controllers/commentController"
import { RequestHandler } from "express";

const verifyAccessToken = expressjwt({
  secret: process.env.Jwt_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
})

const verifyProductAuthorid: RequestHandler = async (req, res, next) => {
  const { id: productId } = req.params;
  try {
    const product = await getProduct(productId);

    if (!product) {
      const error = new Error('Product not found')
      error.code = 404;
      throw error;
    }

    if (product.userId !== req.user.userId) {
      const error = new Error(`Forbidden`);
      error.code = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error)
  }
}

const verifyArticleAuthorid: RequestHandler = async (req, res, next) => {
  const { id: articleId } = req.params;
  try {
    const article = await getArticle(articleId);

    if (!article) {
      const error = new Error('Article not found')
      error.code = 404;
      throw error;
    }

    if (article.userId !== req.user.userId) {
      const error = new Error(`Forbidden`);
      error.code = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error)
  }
}

const verifyProductCommentUserid: RequestHandler = async (req, res, next) => { //댓글 등록 유저만 댓글 수정 삭제 가능
  const commentId = Number(req.params.id);
  try {
    const comment = await getComment(commentId);

    if (!comment) {
      const error = new Error('Comment not found')
      error.code = 404;
      throw error;
    }

    if (comment.userId !== req.user.userId) {
      const error = new Error(`Forbidden`);
      error.code = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error)
  }
}

const verifyArticleCommentUserid: RequestHandler = async (req, res, next) => { //댓글 등록 유저만 댓글 수정 삭제 가능
  /**
   * useId가 일치하는 id(CommentId)를 찾아야함.
   * 1. userId를 받음
   * 2. userId로 commentId를 검색
   */
  
  const { id: commentId } = req.params;
  try {
    const comment = await getArticleComment(commentId);

    if (!comment) {
      const error = new Error('Comment not found')
      error.code = 404;
      throw error;
    }

    if (comment.userId !== req.user?.id) {
      const error = new Error(`Forbidden`);
      error.code = 403;
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
  verifyProductCommentUserid,
  verifyArticleCommentUserid,
}