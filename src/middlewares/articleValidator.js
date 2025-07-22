import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(1, '제목을 입력해 주세요.'),
  content: z.string().min(1, '내용을 입력해 주세요.'),
})

export const validateArticle = (req, res, next) => {
  try {
    articleSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: '게시글 유효성 검사 실패',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    next(err);
  }
}