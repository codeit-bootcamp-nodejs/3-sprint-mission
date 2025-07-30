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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleComment = exports.updateArticleComment = exports.findAllArticleComments = exports.createArticleComment = void 0;
const queryHelpers_js_1 = require("../utils/queryHelpers.js");
const createArticleComment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ articleId, userId, content }) {
    const data = (0, queryHelpers_js_1.prepareCommentCreateData)({ parentId: articleId, userId, content }, 'article');
    const newComment = yield queryHelpers_js_1.prisma.articleComment.create({
        data: data,
        include: (0, queryHelpers_js_1.getCommentIncludeOptions)('title')
    });
    return newComment;
});
exports.createArticleComment = createArticleComment;
const findAllArticleComments = (_a) => __awaiter(void 0, [_a], void 0, function* ({ articleId, cursor, limit }) {
    return (0, queryHelpers_js_1.findCommentsCommon)('articleComment', articleId, { cursor, limit }, 'title');
});
exports.findAllArticleComments = findAllArticleComments;
const updateArticleComment = (commentId_1, _a) => __awaiter(void 0, [commentId_1, _a], void 0, function* (commentId, { content, userId }) {
    yield (0, queryHelpers_js_1.checkCommentOwnership)(commentId, userId, 'articleComment');
    const updatedComment = yield queryHelpers_js_1.prisma.articleComment.update({
        where: { id: commentId },
        data: { content },
        select: {
            id: true,
            content: true,
            userId: true,
            articleId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedComment;
});
exports.updateArticleComment = updateArticleComment;
const deleteArticleComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, queryHelpers_js_1.checkCommentOwnership)(commentId, userId, 'articleComment');
    const deletedComment = yield queryHelpers_js_1.prisma.articleComment.delete({
        where: { id: commentId },
        select: {
            id: true,
            content: true,
            userId: true,
            articleId: true,
        },
    });
    return deletedComment;
});
exports.deleteArticleComment = deleteArticleComment;
