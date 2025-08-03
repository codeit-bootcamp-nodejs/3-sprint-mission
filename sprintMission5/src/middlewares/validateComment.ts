import { validate } from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import { createComment, patchComment } from '../structs/commentStructs';
import { ERROR_MESSAGES } from '../constants/errorConstants';
import { VALIDATION_COMMENT_ERRORS } from '../constants/commentConstants';

export function validateCreateComment(req: Request, res: Response, next: NextFunction) {
  const [error] = validate(req.body, createComment);

  if (error) {
    const field = error.path[0] as keyof typeof VALIDATION_COMMENT_ERRORS;
    const message = VALIDATION_COMMENT_ERRORS[field] || ERROR_MESSAGES.INPUT_INVALID_ERROR;
    return res.status(400).json({ message });
  }
  next();
}

export function validatePatchComment(req: Request, res: Response, next: NextFunction) {
  const [error] = validate(req.body, patchComment);

  if (error) {
    const field = error.path[0] as keyof typeof VALIDATION_COMMENT_ERRORS;
    const message = VALIDATION_COMMENT_ERRORS[field] || ERROR_MESSAGES.INPUT_INVALID_ERROR;
    return res.status(400).json({ message });
  }
  next();
}