import dotenv from 'dotenv';
dotenv.config();
import { expressjwt } from 'express-jwt'
import { RequestHandler } from 'express';
import { GetResourceFn } from '../types/auth';
import { HttpError } from '../types/error';
import ProductService from '../services/productService';
import ArticleService from '../services/articleService';
import CommentService from '../services/commentService';



const verifyAccessToken = expressjwt({
  secret: (process.env.JWT_ACCESS_SECRET)!,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

const verifyRefreshToken = expressjwt({
  secret: (process.env.JWT_REFRESH_SECRET)!,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
  requestProperty: 'user'
});

/**
 * 유저가 등록한 리소스에 대한 권한을 확인하는 미들웨어 생성 함수
 * @param getResource 리소스를 가져오는 함수
 * @param resourceName 리소스 이름 (예: '상품', '게시글', '댓글')
 * @returns RequestHandler
 */

const createVerifyAuth = (getResource: GetResourceFn, resourceName: string): RequestHandler => {
  return async (req, res, next): Promise<void> => {
    const resourceId = req.params.id;
    const userId = req.user?.userId;

    try {
      const resource = await getResource(resourceId);
      if (!resource) {
        throw new HttpError(`존재하지 않는 ${resourceName}입니다.`, 404);
      }

      if (resource.userId !== userId) {
        throw new HttpError(`${resourceName}을(를) 등록한 유저가 아닙니다`, 403);
      }

      return next();
    } catch (error) {
      const err = error as { status?: number; message?: string };
      err.status = err.status || 500;
      err.message = err.message || `${resourceName} 권한 확인 중 오류가 발생했습니다.`;
      next(err);
    }
  }
};

const authProductVerifyAuth = createVerifyAuth(ProductService.getProduct, '상품');
const authArticleVerifyAuth = createVerifyAuth(ArticleService.getArticle, '게시글');
const authCommentVerifyAuth = createVerifyAuth(CommentService.getComment, '댓글');

export default {
  verifyAccessToken,
  verifyRefreshToken,
  authProductVerifyAuth,
  authArticleVerifyAuth,
  authCommentVerifyAuth
};