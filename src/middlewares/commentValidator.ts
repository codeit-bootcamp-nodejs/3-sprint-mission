import { z } from 'zod';
import type { RequestHandler } from 'express';
import { CustomError } from '../utils/CustomError.js';

const commentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해 주세요.'),
});

const idParamSchema = z.object({
  productId: z
    .string()
    .regex(/^\d+$/, '유효하지 않은 상품 ID입니다.')
    .transform((val) => Number(val))
    .optional(),

  articleId: z
    .string()
    .regex(/^\d+$/, '유효하지 않은 게시글 ID입니다.')
    .transform((val) => Number(val))
    .optional(),
});

export type ParsedCommentParams = z.infer<typeof idParamSchema>;

export const validateComment: RequestHandler = (req, _res, next) => {
  try {
    commentSchema.parse(req.body);
    req.parsedParams = idParamSchema.parse(req.params);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');

      throw new CustomError(`댓글 유효성 검사 실패: ${errorMessages}`, 400);
    }

    next(err);
  }
};