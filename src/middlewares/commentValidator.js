import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해 주세요.'),
})

const idParamSchema = z.object({
  productId: z.string().regex(/^\d+$/, '유효하지 않은 상품 ID입니다.').transform(Number).optional(),
  articleId: z.string().regex(/^\d+$/, '유효하지 않은 게시글 ID입니다.').transform(Number).optional(),
})

export const validateComment = (req, res, next) => {
  try {
    // 본문 검증
    commentSchema.parse(req.body);

    // 파라미터 ID 검증
    const parsedParams = idParamSchema.parse(req.params);

    if (parsedParams.productId !== undefined) req.params.productId = parsedParams.productId;
    if (parsedParams.articleId !== undefined) req.params.articleId = parsedParams.articleId;

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: '댓글 유효성 검사 실패',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    next(err);
  }
}