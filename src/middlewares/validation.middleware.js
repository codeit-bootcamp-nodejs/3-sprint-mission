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
  password: s.refine(s.string(), 'password', (value) => {
    return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(value) ||
      '비밀번호는 영문과 숫자 조합으로 8자에서 16자 사이여야 합니다.';
  }),
  imageUrl: s.optional(s.string()),
});

export const updateUserSchema = s.object({
  username: s.optional(s.size(s.string(), 2, 20)),
  email: s.optional(Email),
  address: s.optional(s.size(s.string(), 5, 100)),
  password: s.optional(s.refine(s.string(), 'password', (value) => {
    return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(value) ||
      '비밀번호는 영문과 숫자 조합으로 8자에서 16자 사이여야 합니다.';
  })),
  imageUrl: s.optional(s.string()),
});

export const loginSchema = s.object({
  email: Email,
  password: s.string(), // 로그인 시에는 문자열이기만 하면 됩니다.
});

// --- Product 관련 스키마 --- (변경 없음)
export const createProductSchema = s.object({
  name: s.size(s.string(), 2, 50),
  description: s.optional(s.size(s.string(), 0, 500)),
  price: s.min(s.number(), 1),
  isSold: s.optional(s.boolean()),
  tags: s.optional(s.size(s.array(ProductTagEnum), 1, 5)),
  stock: s.optional(s.min(s.number(), 0)),
  imageUrl: s.optional(s.string()),
});

export const updateProductSchema = s.object({
  name: s.optional(s.size(s.string(), 2, 50)),
  description: s.optional(s.size(s.string(), 0, 500)),
  price: s.optional(s.min(s.number(), 1)),
  isSold: s.optional(s.boolean()),
  tags: s.optional(s.size(s.array(ProductTagEnum), 1, 5)),
  stock: s.optional(s.min(s.number(), 0)),
  imageUrl: s.optional(s.string()),
});

export const getProductByIdSchema = s.object({
  productId: Uuid,
});

// --- Article 관련 스키마 --- (변경 없음)
export const createArticleSchema = s.object({
  title: s.size(s.string(), 5, 100),
  content: s.size(s.string(), 10, 5000),
  imageUrl: s.optional(s.string()),
});

export const updateArticleSchema = s.object({
  title: s.optional(s.size(s.string(), 5, 100)),
  content: s.optional(s.size(s.string(), 10, 5000)),
  imageUrl: s.optional(s.string()),
});

export const getArticleByIdSchema = s.object({
  articleId: Uuid,
});


// --- Comment 관련 스키마 --- (변경 없음)
export const CommentBaseSchema = s.object({
  content: s.size(s.string(), 1, 500),
});

export const UpdateCommentBaseSchema = s.object({
  content: s.optional(s.size(s.string(), 1, 500)),
});

export const updateProductCommentParamsSchema = s.object({
  productId: Uuid, // 기존 상품 ID 유효성 검사
  id: Uuid,         // <-- 이 줄을 추가해야 합니다! (댓글 ID 유효성 검사)
});

export const updateArticleCommentParamsSchema = s.object({
  articleId: Uuid,
  id: Uuid, // <-- 이 줄도 추가해야 합니다! (게시글 댓글 ID 유효성 검사, 미리 해두는 것이 좋습니다)
});

// --- 유효성 검사 미들웨어 ---
export const validate = (schema, type) => (req, res, next) => {
  try {
    s.assert(req[type], schema);
    next();
  } catch (error) {
    if (error instanceof s.StructError) { // Superstruct의 StructError 타입인지 확인
      return res.status(400).json({
        message: '유효성 검사 오류',
        details: Array.from(error.failures()).map(failure => ({
          type: failure.type,
          expected: failure.expected,
          message: failure.message,
        })),
      });
    } else {
      // 예상치 못한 다른 종류의 에러 처리
      console.error('Unexpected error in validation middleware:', error);
      return res.status(500).json({
        message: '서버 내부 오류',
        details: [{ message: error.message || '알 수 없는 오류가 발생했습니다.' }],
      });
    }
  }
};