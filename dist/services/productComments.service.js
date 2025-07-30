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
exports.deleteProductComment = exports.updateProductComment = exports.findAllProductComments = exports.createProductComment = void 0;
const queryHelpers_js_1 = require("../utils/queryHelpers.js");
const createProductComment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, userId, content }) {
    try {
        const data = (0, queryHelpers_js_1.prepareCommentCreateData)({ parentId: productId, userId, content }, 'product');
        const newComment = yield queryHelpers_js_1.prisma.productComment.create({
            data: data,
            include: (0, queryHelpers_js_1.getCommentIncludeOptions)('name')
        });
        return newComment;
    }
    catch (error) {
        throw error;
    }
});
exports.createProductComment = createProductComment;
const findAllProductComments = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, cursor, limit }) {
    try {
        return (0, queryHelpers_js_1.findCommentsCommon)('productComment', productId, { cursor, limit }, 'name');
    }
    catch (error) {
        throw error;
    }
});
exports.findAllProductComments = findAllProductComments;
const updateProductComment = (commentId_1, _a) => __awaiter(void 0, [commentId_1, _a], void 0, function* (commentId, { content, userId }) {
    try {
        yield (0, queryHelpers_js_1.checkCommentOwnership)(commentId, userId, 'productComment');
        const updatedComment = yield queryHelpers_js_1.prisma.productComment.update({
            where: { id: commentId },
            data: { content },
            select: {
                id: true,
                content: true,
                userId: true,
                productId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedComment;
    }
    catch (error) {
        throw error;
    }
});
exports.updateProductComment = updateProductComment;
const deleteProductComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, queryHelpers_js_1.checkCommentOwnership)(commentId, userId, 'productComment');
        const deletedComment = yield queryHelpers_js_1.prisma.productComment.delete({
            where: { id: commentId },
            select: {
                id: true,
                content: true,
                userId: true,
                productId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return deletedComment;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteProductComment = deleteProductComment;
