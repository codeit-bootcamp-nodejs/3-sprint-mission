import { Request } from 'express';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      uploadPath?: string;
      file?: File;
      files?: { [fieldname: string]: File[] } | File[];
      user?: {
        userId: string;
      }
      cookies: {
        refreshToken: string;
      }
    }
  }
}

export { }