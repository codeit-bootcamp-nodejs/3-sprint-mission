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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_js_1 = __importDefault(require("../utils/asyncHandler.js"));
const auth_js_1 = require("../middlewares/auth.js");
const validation_middleware_js_1 = require("../middlewares/validation.middleware.js");
const productComments_service_js_1 = require("../services/productComments.service.js");
const productCommentRouter = express_1.default.Router({ mergeParams: true });
productCommentRouter.route('/')
    .post(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getProductByIdSchema, 'params'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.CommentBaseSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { content } = req.body;
    const newComment = yield (0, productComments_service_js_1.createProductComment)({ productId, userId, content });
    res.status(201).json({
        message: '댓글이 저장되었습니다',
        data: newComment
    });
})))
    .get((0, validation_middleware_js_1.validate)(validation_middleware_js_1.getProductByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { cursor, limit } = req.query;
    const { comments, nextCursor } = yield (0, productComments_service_js_1.findAllProductComments)({ productId, cursor, limit });
    res.status(200).json({
        message: '요청하신 상품 댓글목록 입니다',
        data: comments,
        nextCursor
    });
})));
productCommentRouter.route('/:id')
    .patch(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateProductCommentParamsSchema, 'params'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.UpdateCommentBaseSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id: commentId } = req.params;
    const { content } = req.body;
    const updatedComment = yield (0, productComments_service_js_1.updateProductComment)(commentId, { content, userId });
    res.status(200).json({
        message: '상품 댓글이 성공적으로 수정되었습니다.',
        data: updatedComment
    });
})))
    .delete(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateProductCommentParamsSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id: commentId } = req.params;
    const deletedComment = yield (0, productComments_service_js_1.deleteProductComment)(commentId, userId);
    res.status(204).end();
})));
exports.default = productCommentRouter;
