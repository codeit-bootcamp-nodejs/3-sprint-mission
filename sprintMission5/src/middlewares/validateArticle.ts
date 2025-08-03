import { validate } from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import { createArticle, patchArticle } from '../structs/articleStructs';
import { ERROR_MESSAGES } from '../constants/errorConstants';
import { VALIDATION_ARTICLE_ERRORS } from '../constants/articleConstants';

export function validateCreateArticle(req: Request, res: Response, next: NextFunction) {
  const [error] = validate(req.body, createArticle);

  if (error) {
    const field = error.path[0] as keyof typeof VALIDATION_ARTICLE_ERRORS;
    const message = VALIDATION_ARTICLE_ERRORS[field] || ERROR_MESSAGES.INPUT_INVALID_ERROR;
    return res.status(400).json({ message });
  }
  next();
}

export function validatePatchArticle(req: Request, res: Response, next: NextFunction) {
  const [error] = validate(req.body, patchArticle);

  if (error) {
    const field = error.path[0] as keyof typeof VALIDATION_ARTICLE_ERRORS;
    const message = VALIDATION_ARTICLE_ERRORS[field] || ERROR_MESSAGES.INPUT_INVALID_ERROR;
    return res.status(400).json({ message });
  }
  next();
}