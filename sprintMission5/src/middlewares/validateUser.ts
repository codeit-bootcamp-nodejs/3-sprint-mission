import { z } from 'zod';
import { RequestHandler } from 'express';
import { HttpError } from '../types/error';

const baseUserSchema = z.object({
  email: z.email({ message: '유효한 이메일을 입력해주세요.' }),
  nickname: z.string()
    .min(1, { message: '닉네임은 1자 이상이어야 합니다.' })
    .max(8, { message: '닉네임은 8자 이하이어야 합니다.' }),
  password: z.string()
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' }),
  image: z.string().optional(),
});

const userCreateSchema = baseUserSchema;
const userUpdateSchema = baseUserSchema.partial().pick({
  nickname: true,
  image: true,
});

const createValidateMiddleware = (schema: typeof userCreateSchema | typeof userUpdateSchema): RequestHandler => (req, res, next) => {
  const user: Record<string, string | undefined> = {};
  for (const key of Object.keys(schema.shape)) {
    if (req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  }
  const validation = schema.safeParse(user);
  if (!validation.success) {
    const messages = validation.error.issues.map((issue) => issue.message);
    const error = new HttpError(messages.join(', '), 400);
    return next(error);
  }
  next();
};

export const validateUserCreate = createValidateMiddleware(userCreateSchema);
export const validateUserUpdate = createValidateMiddleware(userUpdateSchema);