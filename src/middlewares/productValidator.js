import { z } from 'zod';

const productCreateSchema = z.object({
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

const productUpdateSchema = productCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: '수정할 내용을 최소 1개 이상 입력해 주세요.' }
)

export const validateProductCreate = (req, res, next) => {
  try {
    const parsedBody = {
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    };

    productCreateSchema.parse(parsedBody);
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

export const validateProductUpdate = (req, res, next) => {
  try {
    const parsedBody = {
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    };

    productUpdateSchema.parse(parsedBody);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: '상품 수정 유효성 검사 실패',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    next(err);
  }
}
