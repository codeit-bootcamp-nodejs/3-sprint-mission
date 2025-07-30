"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommentsCommon = exports.getCommentIncludeOptions = exports.prepareCommentCreateData = exports.checkArticleOwnership = exports.checkProductOwnership = exports.checkCommentOwnership = exports.calculateNextCursor = exports.getCursorPaginationOptions = exports.getSearchParams = exports.getSortParams = exports.getPaginationParams = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
exports.prisma = global.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
const getPaginationParams = (query) => {
    const skip = parseInt(query.offset) || 0;
    const take = parseInt(query.limit) || 10;
    return { skip, take };
};
exports.getPaginationParams = getPaginationParams;
const getSortParams = (query, defaultSortField = 'createdAt') => {
    const { sort } = query;
    const order = sort === 'recent' ? 'desc' : 'asc';
    return {
        [defaultSortField]: order,
    };
};
exports.getSortParams = getSortParams;
const getSearchParams = (search, fields) => {
    if (!search || !fields || fields.length === 0) {
        return {};
    }
    return {
        OR: fields.map(field => ({
            [field]: {
                contains: search,
                mode: 'insensitive',
            },
        })),
    };
};
exports.getSearchParams = getSearchParams;
const getCursorPaginationOptions = ({ cursor, limit }) => {
    const parsedLimit = parseInt(limit, 10) || 10;
    const options = {
        take: parsedLimit,
    };
    if (cursor) {
        options.cursor = {
            id: cursor,
        };
        options.skip = 1;
    }
    return Object.assign(Object.assign({}, options), { parsedLimit });
};
exports.getCursorPaginationOptions = getCursorPaginationOptions;
const calculateNextCursor = (items, parsedLimit) => {
    if (items.length === parsedLimit) {
        return items[items.length - 1].id;
    }
    return null;
};
exports.calculateNextCursor = calculateNextCursor;
const checkCommentOwnership = (commentId, usersId, modelName) => __awaiter(void 0, void 0, void 0, function* () {
    const model = exports.prisma[modelName];
    if (!model) {
        const error = new Error(`Invalid model name provided: ${modelName}`);
        error.statusCode = 500;
        throw error;
    }
    const comment = yield model.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw new library_1.PrismaClientKnownRequestError('댓글을 찾을 수 없습니다.', {
            code: 'P2025',
            meta: { modelName: modelName, cause: 'record not found' },
        });
    }
    if (comment.userId !== usersId) {
        const error = new Error('댓글을 수정/삭제할 권한이 없습니다.');
        error.statusCode = 403;
        throw error;
    }
    return comment;
});
exports.checkCommentOwnership = checkCommentOwnership;
const checkProductOwnership = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield exports.prisma.product.findUnique({
        where: { id: productId },
        select: { userId: true },
    });
    if (!product) {
        throw new library_1.PrismaClientKnownRequestError('상품을 찾을 수 없습니다.', {
            code: 'P2025',
            meta: { modelName: 'Product', cause: 'record not found' },
        });
    }
    if (product.userId !== userId) {
        const error = new Error('상품을 수정하거나 삭제할 권한이 없습니다.');
        error.statusCode = 403;
        throw error;
    }
});
exports.checkProductOwnership = checkProductOwnership;
const checkArticleOwnership = (articleId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield exports.prisma.article.findUnique({
        where: { id: articleId },
        select: { userId: true },
    });
    if (!article) {
        throw new library_1.PrismaClientKnownRequestError('게시글을 찾을 수 없습니다.', {
            code: 'P2025',
            meta: { modelName: 'Article', cause: 'record not found' },
        });
    }
    if (article.userId !== userId) {
        const error = new Error('게시글을 수정하거나 삭제할 권한이 없습니다.');
        error.statusCode = 403;
        throw error;
    }
});
exports.checkArticleOwnership = checkArticleOwnership;
const prepareCommentCreateData = ({ parentId, userId, content }, parentModelName) => {
    const data = {
        content: content,
        [parentModelName === 'product' ? 'product' : 'article']: {
            connect: {
                id: parentId,
            },
        },
    };
    if (userId) {
        data.user = {
            connect: {
                id: userId,
            },
        };
    }
    return data;
};
exports.prepareCommentCreateData = prepareCommentCreateData;
const getCommentIncludeOptions = (parentSelectField) => ({
    user: {
        select: {
            username: true
        }
    },
    [parentSelectField === 'name' ? 'product' : 'article']: {
        select: {
            [parentSelectField]: true
        }
    }
});
exports.getCommentIncludeOptions = getCommentIncludeOptions;
const findCommentsCommon = (modelName, parentId, queryParams, parentSelectField) => __awaiter(void 0, void 0, void 0, function* () {
    const model = exports.prisma[modelName];
    const _a = (0, exports.getCursorPaginationOptions)(queryParams), { parsedLimit } = _a, findManyOptions = __rest(_a, ["parsedLimit"]);
    const comments = yield model.findMany(Object.assign(Object.assign({ where: {
            [parentSelectField === 'name' ? 'productId' : 'articleId']: parentId
        } }, findManyOptions), { include: (0, exports.getCommentIncludeOptions)(parentSelectField), orderBy: { createdAt: 'desc' } }));
    const nextCursor = (0, exports.calculateNextCursor)(comments, parsedLimit);
    return { comments, nextCursor };
});
exports.findCommentsCommon = findCommentsCommon;
