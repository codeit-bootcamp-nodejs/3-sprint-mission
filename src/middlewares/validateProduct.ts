import { validate } from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import { createProduct, patchProduct } from '../structs/productStructs';
import { ERROR_MESSAGES } from '../constants/errorConstants';
import { VALIDATION_PRODUCT_ERRORS } from '../constants/productConstants';


export function validateCreateProduct(req: Request, res: Response, next: NextFunction) {
  const [error] = validate(req.body, createProduct);

  if (error) {
    const field = error.path[0] as keyof typeof VALIDATION_PRODUCT_ERRORS;
    const message = VALIDATION_PRODUCT_ERRORS[field] || ERROR_MESSAGES.INPUT_INVALID_ERROR;
    return res.status(400).json({ message });
  }
  next();
}

export function validatePatchProduct(req: Request, res: Response, next: NextFunction) {
  const [error] = validate(req.body, patchProduct);

  if (error) {
    const field = error.path[0] as keyof typeof VALIDATION_PRODUCT_ERRORS;
    const message = VALIDATION_PRODUCT_ERRORS[field] || ERROR_MESSAGES.INPUT_INVALID_ERROR;
    return res.status(400).json({ message });
  }
  next();
}