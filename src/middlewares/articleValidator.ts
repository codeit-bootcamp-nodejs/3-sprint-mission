import { z } from 'zod';
import type { RequestHandler } from 'express';
import { CustomError } from '../utils/CustomError.js';

const articleCreateSchema = z.object({
  title: z.string().min(1, '제목을 입력해 주세요.'),
  content: z.string().min(1, '내용을 입력해 주세요.'),
});

const articleUpdateSchema = z
  .object({
    title: z.string().min(1, '제목을 입력해 주세요.').optional(),
    content: z.string().min(1, '내용을 입력해 주세요.').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정할 내용을 최소 1개 이상 입력해 주세요.',
  });

export const validateArticleCreate: RequestHandler = (req, _res, next) => {
  try {
    articleCreateSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const msg = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new CustomError(`게시글 유효성 검사 실패: ${msg}`, 400));
    }
    next(err);
  }
};

export const validateArticleUpdate: RequestHandler = (req, _res, next) => {
  try {
    articleUpdateSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const msg = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new CustomError(`게시글 유효성 검사 실패: ${msg}`, 400));
    }
    next(err);
  }
};
