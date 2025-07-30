import type { RequestHandler } from 'express';
import { z } from 'zod';
import { CustomError } from '../utils/CustomError.js';

const articleSchema = z.object({
  title: z.string().min(1, '제목을 입력해 주세요.'),
  content: z.string().min(1, '내용을 입력해 주세요.'),
});

export const validateArticle: RequestHandler = (req, _res, next) => {
  try {
    articleSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');

      throw new CustomError(`게시글 유효성 검사 실패: ${errorMessages}`, 400);
    }

    next(err);
  }
};