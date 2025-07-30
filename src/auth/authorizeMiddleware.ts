import type { RequestHandler } from 'express';
import { PrismaClient, Product, Article, Comment } from '@prisma/client';
import { CustomError } from '../utils/CustomError.js';

const prisma = new PrismaClient();

const resourceText = {
  product: '상품',
  article: '게시글',
  comment: '댓글'
} as const;

type ResourceType = keyof typeof resourceText;

type ResourceRecord = {
  product: (id: number) => Promise<Product | null>;
  article: (id: number) => Promise<Article | null>;
  comment: (id: number) => Promise<Comment | null>;
};

const resourceMap: ResourceRecord = {
  product: (id) => prisma.product.findUnique({ where: { id } }),
  article: (id) => prisma.article.findUnique({ where: { id } }),
  comment: (id) => prisma.comment.findUnique({ where: { id } }),
};

/**
 * @middleware authorize
 * 
 * @description
 * 리소스(상품, 게시글, 댓글 등)의 작성자인지를 확인하는 인가 미들웨어입니다.
 * 요청 경로의 `:id`를 기반으로 해당 리소스를 조회하고,
 * 로그인한 사용자의 ID와 비교하여 수정/삭제 권한이 있는지 확인합니다.
 * 
 * `type`에 따라 `resourceMap`을 참조하여 Prisma 모델을 동적으로 선택합니다.
 * 
 * @param {'product' | 'article' | 'comment' } type - 검사할 리소스 종류
 * @returns {Function} Express 미들웨어 함수
 * 
 * @throws {400} ID가 유효하지 않거나 리소스 타입이 잘못된 경우
 * @throws {404} 해당 리소스를 찾을 수 없는 경우
 * @throws {403} 사용자에게 권한이 없는 경우
 */
export const authorize = (type: ResourceType): RequestHandler => async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('ID가 올바르지 않습니다.', 400);

  const fetchResource = resourceMap[type];
  if (!fetchResource) throw new CustomError('유효하지 않은 리소스 유형입니다.', 400);

  const resource = await fetchResource(id);
  if (!resource) throw new CustomError(`해당 ${resourceText[type]}을 찾을 수 없습니다.`, 404);

  const userId = req.user.id;
  if (resource.userId !== userId) throw new CustomError(`해당 ${resourceText[type]}에 대한 수정/삭제 권한이 없습니다.`, 403);

  next();
};