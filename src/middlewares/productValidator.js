import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, '상품 이름을 작성해 주세요.'),
  description: z.string().min(1, '상품 설명을 작성해 주세요.'),
  price: z
    .number({
      invalid_type_error: '가격은 숫자로 입력해 주세요.',
    })
    .int()
    .nonnegative('가격을 작성해 주세요.'),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
})

export const validateProduct = (req, res, next) => {
  try {
    const parsedBody = {
      ...req.body,
      price: Number(req.body.price),
    }

    productSchema.parse(parsedBody);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: '상품 등록 유효성 검사 실패',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    next(err);
  }
}