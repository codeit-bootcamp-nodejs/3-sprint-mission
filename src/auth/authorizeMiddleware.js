import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resourceText = {
  product: '상품',
  article: '게시글',
  comment: '댓글'
};

const resourceMap = {
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
 * @returns {400} ID가 유효하지 않거나 리소스 타입이 잘못된 경우
 * @returns {404} 해당 리소스를 찾을 수 없는 경우
 * @returns {403} 사용자에게 권한이 없는 경우
 */
export const authorize = (type) => async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID가 올바르지 않습니다.' });

  const fetchResource = resourceMap[type];
  if (!fetchResource) return res.status(400).json({ message: '유효하지 않은 리소스 유형입니다.' });

  try {
    const resource = await fetchResource(id);
    if (!resource) return res.status(404).json({ message: `해당 ${resourceText[type]}을 찾을 수 없습니다.` })

    const userId = req.user.id;
    if (resource.userId !== userId) return res.status(403).json({ message: `해당 ${resourceText[type]}에 대한 수정/삭제 권한이 없습니다.` });

    next();
  } catch (err) {
    console.error('❌ Authorize failed:', err.message);
    return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
};