import { assert } from 'superstruct';
import { Product, Article } from '../structs.js';

// 상품 등록/수정 시 유효성 검증
export function validateProduct(req, res, next) {
  try {
    assert(req.body, Product);
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 게시글 등록/수정 시 유효성 검증
export function validateArticle(req, res, next) {
  try {
    assert(req.body, Article);
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}