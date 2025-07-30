"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.updateArticleCommentParamsSchema = exports.updateProductCommentParamsSchema = exports.UpdateCommentBaseSchema = exports.CommentBaseSchema = exports.getArticleByIdSchema = exports.updateArticleSchema = exports.createArticleSchema = exports.getProductByIdSchema = exports.updateProductSchema = exports.createProductSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = exports.ProductTagEnum = exports.Email = exports.Uuid = void 0;
const s = __importStar(require("superstruct"));
const is_email_1 = __importDefault(require("is-email"));
const is_uuid_1 = __importDefault(require("is-uuid"));
// --- 공통 타입 정의 ---
exports.Uuid = s.define('Uuid', (value) => is_uuid_1.default.v4(value));
exports.Email = s.define('Email', (value) => {
    if (typeof value !== 'string') {
        return false;
    }
    return (0, is_email_1.default)(value);
});
exports.ProductTagEnum = s.enums([
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
exports.createUserSchema = s.object({
    username: s.size(s.string(), 2, 20),
    email: exports.Email,
    address: s.optional(s.size(s.string(), 5, 100)),
    password: s.refine(s.string(), 'password', (value) => {
        return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(value) ||
            '비밀번호는 영문과 숫자 조합으로 8자에서 16자 사이여야 합니다.';
    }),
    imageUrl: s.optional(s.string()),
});
exports.updateUserSchema = s.object({
    username: s.optional(s.size(s.string(), 2, 20)),
    email: s.optional(exports.Email),
    address: s.optional(s.size(s.string(), 5, 100)),
    password: s.optional(s.refine(s.string(), 'password', (value) => {
        return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(value) ||
            '비밀번호는 영문과 숫자 조합으로 8자에서 16자 사이여야 합니다.';
    })),
    imageUrl: s.optional(s.string()),
});
exports.loginSchema = s.object({
    email: exports.Email,
    password: s.string(), // 로그인 시에는 문자열이기만 하면 됩니다.
});
// --- Product 관련 스키마 --- (변경 없음)
exports.createProductSchema = s.object({
    name: s.size(s.string(), 2, 50),
    description: s.optional(s.size(s.string(), 0, 500)),
    price: s.min(s.number(), 1),
    isSold: s.optional(s.boolean()),
    tags: s.optional(s.size(s.array(exports.ProductTagEnum), 1, 5)),
    stock: s.optional(s.min(s.number(), 0)),
    imageUrl: s.optional(s.string()),
});
exports.updateProductSchema = s.object({
    name: s.optional(s.size(s.string(), 2, 50)),
    description: s.optional(s.size(s.string(), 0, 500)),
    price: s.optional(s.min(s.number(), 1)),
    isSold: s.optional(s.boolean()),
    tags: s.optional(s.size(s.array(exports.ProductTagEnum), 1, 5)),
    stock: s.optional(s.min(s.number(), 0)),
    imageUrl: s.optional(s.string()),
});
exports.getProductByIdSchema = s.object({
    productId: exports.Uuid,
});
// --- Article 관련 스키마 --- (변경 없음)
exports.createArticleSchema = s.object({
    title: s.size(s.string(), 5, 100),
    content: s.size(s.string(), 10, 5000),
    imageUrl: s.optional(s.string()),
});
exports.updateArticleSchema = s.object({
    title: s.optional(s.size(s.string(), 5, 100)),
    content: s.optional(s.size(s.string(), 10, 5000)),
    imageUrl: s.optional(s.string()),
});
exports.getArticleByIdSchema = s.object({
    articleId: exports.Uuid,
});
// --- Comment 관련 스키마 --- (변경 없음)
exports.CommentBaseSchema = s.object({
    content: s.size(s.string(), 1, 500),
});
exports.UpdateCommentBaseSchema = s.object({
    content: s.optional(s.size(s.string(), 1, 500)),
});
exports.updateProductCommentParamsSchema = s.object({
    productId: exports.Uuid, // 기존 상품 ID 유효성 검사
    id: exports.Uuid, // <-- 이 줄을 추가해야 합니다! (댓글 ID 유효성 검사)
});
exports.updateArticleCommentParamsSchema = s.object({
    articleId: exports.Uuid,
    id: exports.Uuid, // <-- 이 줄도 추가해야 합니다! (게시글 댓글 ID 유효성 검사, 미리 해두는 것이 좋습니다)
});
// --- 유효성 검사 미들웨어 ---
const validate = (schema, type) => (req, res, next) => {
    try {
        s.assert(req[type], schema);
        next();
    }
    catch (error) {
        if (error instanceof s.StructError) {
            // Superstruct 에러를 캐치했을 때, 커스텀 에러 객체를 생성하여 next()로 전달합니다.
            // 이 커스텀 에러 객체에 message와 details를 담아서 전달합니다.
            const validationError = new Error('유효성 검사 오류');
            validationError.statusCode = 400;
            validationError.details = Array.from(error.failures()).map((failure) => ({
                type: failure.type,
                expected: failure.expected,
                message: failure.message,
            }));
            next(validationError);
        }
        else {
            next(error); // 예상치 못한 에러도 전역 에러 핸들러로 전달
        }
    }
};
exports.validate = validate;
