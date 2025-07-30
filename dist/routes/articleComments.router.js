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
const auth_js_1 = require("../middlewares/auth.js");
const validation_middleware_js_1 = require("../middlewares/validation.middleware.js");
const articleCommentsService = __importStar(require("../services/articleComments.service.js"));
const asyncHandler_js_1 = __importDefault(require("../utils/asyncHandler.js"));
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/')
    .get((0, validation_middleware_js_1.validate)(validation_middleware_js_1.getArticleByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId } = req.params;
    const { cursor, limit } = req.query;
    const { comments, nextCursor } = yield articleCommentsService.findAllArticleComments({ articleId, cursor, limit });
    res.status(200).json({ comments, nextCursor });
})))
    .post(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getArticleByIdSchema, 'params'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.CommentBaseSchema, 'body'), (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { articleId } = req.params;
    const { content } = req.body;
    const newComment = yield articleCommentsService.createArticleComment({
        articleId,
        content,
        userId,
    });
    res.status(201).json(newComment);
})));
router.route('/:id')
    .patch(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateArticleCommentParamsSchema, 'params'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.UpdateCommentBaseSchema, 'body'), (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = yield articleCommentsService.updateArticleComment(id, { content, userId });
    res.status(200).json(updatedComment);
})))
    .delete(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateArticleCommentParamsSchema, 'params'), (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id } = req.params;
    yield articleCommentsService.deleteArticleComment(id, userId);
    res.status(204).send();
})));
exports.default = router;
