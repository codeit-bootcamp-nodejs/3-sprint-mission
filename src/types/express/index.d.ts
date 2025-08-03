import { User } from '@prisma/client';
import { ParsedCommentParams } from '../../middlewares/commentValidator';

declare global {
  namespace Express {
    interface Request {
      user: Pick<User, 'id'>;
      parsedParams?: ParsedCommentParams;
    }
  }
}

export {};