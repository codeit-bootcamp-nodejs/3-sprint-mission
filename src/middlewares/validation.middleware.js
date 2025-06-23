import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';


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
  'VINTAGE'
]);


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

export const createProductSchema = s.object({
  name: s.size(s.string(), 2, 50),
  description: s.optional(s.size(s.string(), 0, 500)),
  price: s.min(s.number(), 1),
  isSold: s.optional(s.boolean()),
  tags: s.optional(s.size(s.array(ProductTagEnum), 1, 5)),
  stock: s.optional(s.min(s.number(), 0)),
  usersId: Uuid,
});

export const updateProductSchema = s.object({
  name: s.optional(s.size(s.string(), 2, 50)),
  description: s.optional(s.size(s.string(), 0, 500)),
  price: s.optional(s.min(s.number(), 1)),
  isSold: s.optional(s.boolean()),
  tags: s.optional(s.size(s.array(ProductTagEnum), 1, 5)),
  stock: s.optional(s.min(s.number(), 0)),
});

export const createArticleSchema = s.object({
  title: s.size(s.string(), 5, 100),
  content: s.size(s.string(), 10, 5000),
  usersId: Uuid,
});

export const updateArticleSchema = s.object({
  title: s.optional(s.size(s.string(), 5, 100)),
  content: s.optional(s.size(s.string(), 10, 5000)),
});

export const createProductCommentSchema = s.object({
  content: s.size(s.string(), 1, 500),
  usersId: Uuid,
});

export const updateProductCommentSchema = s.object({
  content: s.optional(s.size(s.string(), 1, 500)),
  usersId: Uuid,
});

export const deleteProductCommentSchema = s.object({
  usersId: Uuid,
});

export const createArticleCommentSchema = s.object({
  content: s.size(s.string(), 1, 500),
  usersId: Uuid,
})

export const updateArticleCommentSchema = s.object({
  content: s.optional(s.size(s.string(), 1, 500)),
  usersId: Uuid,
});


export const getByIdSchema = s.object({
  id: Uuid,
});

export const getProductByIdSchema = s.object({
  productsId: Uuid,
});

export const getArticleByIdSchema = s.object({
  articlesId: Uuid,
});

export const updateProductCommentParamsSchema = s.object({
  productsId: Uuid,
  id: Uuid,
});

export const updateArticleCommentParamsSchema = s.object({
  articlesId: Uuid,
  id: Uuid,
});


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