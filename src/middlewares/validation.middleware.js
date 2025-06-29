import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

// --- 공통 타입 정의 ---
export const Uuid = s.define('Uuid', (value) => isUuid.v4(value));

export const Email = s.define('Email', (value) => {
  if (typeof value !== 'string') {
    return false;
  }
  return isEmail(value);
});

export const ProductTagEnum = s.enums([
  'NEW_PRODUCT',
  'UNOPENED',
  'USED',
  'A_GRADE',
  'USED_FEELING',
  'DAMAGED',
  'LIMITED_EDITION',
  'DISCONTINUED',
  'FREE_SHIPPING',
  'DIRECT_DEAL',
  'PRICE_NEGOTIABLE',
  'URGENT_SALE',
  'ELECTRONICS',
  'CLOTHING',
  'BOOKS',
  'FURNITURE',
  'SPORTS_EQUIPMENT',
  'RARE_ITEM',
  'FILM_CAMERA',
  'VINTAGE',
  'IMAGE_UPLOADED'
]);

// --- User 관련 스키마 ---
export const createUserSchema = s.object({
  username: s.size(s.string(), 2, 20),
  email: Email,
  address: s.optional(s.size(s.string(), 5, 100)),
});

export const updateUserSchema = s.object({
  username: s.optional(s.size(s.string(), 2, 20)),
  email: s.optional(Email),
  address: s.optional(s.size(s.string(), 5, 100)),
});

// --- Product 관련 스키마 ---
export const createProductSchema = s.object({
  name: s.size(s.string(), 2, 50),
  description: s.optional(s.size(s.string(), 0, 500)),
  price: s.min(s.number(), 1),
  isSold: s.optional(s.boolean()),
  tags: s.optional(s.size(s.array(ProductTagEnum), 1, 5)),
  stock: s.optional(s.min(s.number(), 0)),
  userId: Uuid,
  imageUrl: s.optional(s.string()),
});

export const updateProductSchema = s.object({
  name: s.optional(s.size(s.string(), 2, 50)),
  description: s.optional(s.size(s.string(), 0, 500)),
  price: s.optional(s.min(s.number(), 1)),
  isSold: s.optional(s.boolean()),
  tags: s.optional(s.size(s.array(ProductTagEnum), 1, 5)),
  stock: s.optional(s.min(s.number(), 0)),
  userId: Uuid,
  imageUrl: s.optional(s.string()),
});

export const deleteProductSchema = s.object({
  userId: Uuid,
});

export const getProductByIdSchema = s.object({ 
  productId: Uuid,
});


// --- Article 관련 스키마 ---
export const createArticleSchema = s.object({
  title: s.size(s.string(), 5, 100),
  content: s.size(s.string(), 10, 5000),
  userId: Uuid,
  imageUrl: s.optional(s.string()),
});

export const updateArticleSchema = s.object({
  title: s.optional(s.size(s.string(), 5, 100)),
  content: s.optional(s.size(s.string(), 10, 5000)),
  userId: Uuid,
  imageUrl: s.optional(s.string()),
});

export const deleteArticleSchema = s.object({
  userId: Uuid,
});

export const getArticleByIdSchema = s.object({
  articleId: Uuid,
});


// --- Comment 관련 스키마 ---
export const CommentBaseSchema = s.object({
  content: s.size(s.string(), 1, 500),
  userId: Uuid,
});

export const UpdateCommentBaseSchema = s.object({
  content: s.optional(s.size(s.string(), 1, 500)),
  userId: Uuid,
});

export const DeleteCommentBaseSchema = s.object({
  userId: Uuid,
});


export const getByIdSchema = s.object({
  id: Uuid,
});

export const updateProductCommentParamsSchema = s.object({
  productId: Uuid,
  id: Uuid,
});

export const updateArticleCommentParamsSchema = s.object({
  articleId: Uuid,
  id: Uuid,
});


// --- 유효성 검사 미들웨어 ---
export const validate = (schema, type) => (req, res, next) => {
  try {
    s.assert(req[type], schema);
    next();
  } catch (error) {
    res.status(400).json({
      message: 'Validation Error',
      details: error.failures ? Array.from(error.failures()) : error.message,
    });
  }
};