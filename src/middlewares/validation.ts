import { assert } from 'superstruct';
import { Product, Article } from '../structs';
import { Request, Response, NextFunction } from 'express';

// 상품 등록/수정 시 유효성 검증
export function validateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, Product);
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// 게시글 등록/수정 시 유효성 검증
export function validateArticle(req: Request, res: Response, next: NextFunction) {
  try {
    assert(req.body, Article);
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
}