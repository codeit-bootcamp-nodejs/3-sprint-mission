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
exports.toggleArticleLike = exports.deleteArticle = exports.updateArticle = exports.findArticleById = exports.createArticle = exports.findAllArticles = void 0;
const library_1 = require("@prisma/client/runtime/library");
const queryHelpers_js_1 = require("../utils/queryHelpers.js");
const findAllArticles = (_a) => __awaiter(void 0, [_a], void 0, function* ({ offset, limit, sort, search }) {
    try {
        const { skip, take } = (0, queryHelpers_js_1.getPaginationParams)({ offset, limit });
        const orderBy = (0, queryHelpers_js_1.getSortParams)({ sort }, 'createdAt');
        const where = (0, queryHelpers_js_1.getSearchParams)(search, ['title', 'content']);
        const articles = yield queryHelpers_js_1.prisma.article.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
                _count: {
                    select: {
                        ArticleLike: true,
                    },
                },
            },
        });
        return articles.map(article => (Object.assign(Object.assign({}, article), { likeCount: article._count.ArticleLike, _count: undefined })));
    }
    catch (error) {
        throw error;
    }
});
exports.findAllArticles = findAllArticles;
const createArticle = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, content, userId, imageUrl }) {
    try {
        const newArticle = yield queryHelpers_js_1.prisma.article.create({
            data: {
                title,
                content,
                imageUrl,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return newArticle;
    }
    catch (error) {
        throw error;
    }
});
exports.createArticle = createArticle;
const findArticleById = (articleId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const article = yield queryHelpers_js_1.prisma.article.findUnique({
            where: {
                id: articleId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
                articleComments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        ArticleLike: true,
                    },
                },
                ArticleLike: currentUserId ? {
                    where: { userId: currentUserId }, // 현재 유저가 누른 좋아요만 필터링
                    select: { id: true }, // 좋아요 존재 여부만 확인하므로 id 필드만 선택
                }
                    : false,
            },
        });
        if (!article) {
            throw new library_1.PrismaClientKnownRequestError('게시글을 찾을 수 없습니다.', {
                code: 'P2025',
                meta: { modelName: 'Article', cause: 'record not found' },
            });
        }
        const isLiked = currentUserId ? ((_a = article.ArticleLike) === null || _a === void 0 ? void 0 : _a.length) > 0 : false;
        const likeCount = article._count.ArticleLike;
        const { ArticleLike, _count } = article, articleWithoutLikes = __rest(article, ["ArticleLike", "_count"]);
        return Object.assign(Object.assign({}, articleWithoutLikes), { isLiked, likeCount });
    }
    catch (error) {
        throw error;
    }
});
exports.findArticleById = findArticleById;
const updateArticle = (articleId, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, queryHelpers_js_1.checkArticleOwnership)(articleId, userId);
        const updatedArticle = yield queryHelpers_js_1.prisma.article.update({
            where: {
                id: articleId,
            },
            data: updateData,
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return updatedArticle;
    }
    catch (error) {
        throw error;
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (articleId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, queryHelpers_js_1.checkArticleOwnership)(articleId, userId);
        const deletedArticle = yield queryHelpers_js_1.prisma.article.delete({
            where: {
                id: articleId
            },
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return deletedArticle;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteArticle = deleteArticle;
const toggleArticleLike = (currentUserId, articleId) => __awaiter(void 0, void 0, void 0, function* () {
    const existinglike = yield queryHelpers_js_1.prisma.articleLike.findUnique({
        where: {
            userId_articleId: {
                userId: currentUserId,
                articleId: articleId,
            },
        },
    });
    if (existinglike) {
        yield queryHelpers_js_1.prisma.articleLike.delete({
            where: {
                userId_articleId: {
                    userId: currentUserId,
                    articleId: articleId,
                },
            },
        });
        return { message: '좋아요가 취소되엇습니다' };
    }
    else {
        yield queryHelpers_js_1.prisma.articleLike.create({
            data: {
                userId: currentUserId,
                articleId: articleId,
            },
        });
        return { message: '좋아요가 추가되었습니다' };
    }
});
exports.toggleArticleLike = toggleArticleLike;
