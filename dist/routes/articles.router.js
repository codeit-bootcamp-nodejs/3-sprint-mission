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
const upload_middleware_js_1 = __importDefault(require("../middlewares/upload.middleware.js"));
const auth_js_1 = require("../middlewares/auth.js");
const validation_middleware_js_1 = require("../middlewares/validation.middleware.js");
const articles_service_js_1 = require("../services/articles.service.js");
const articleRouter = express_1.default.Router();
articleRouter.route('/')
    .get((0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { offset, limit, sort, search } = req.query;
    const articles = yield (0, articles_service_js_1.findAllArticles)({ offset, limit, sort, search });
    res.status(200).json({
        message: "조회하신 게시글 목록입니다.",
        data: articles
    });
})))
    .post(auth_js_1.verifyAccessToken, upload_middleware_js_1.default.single('image'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.createArticleSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { title, content } = req.body;
    const imageUrl = req.file
        ? `/uploads/articles/${req.file.filename}`
        : null;
    const newArticle = yield (0, articles_service_js_1.createArticle)({ title, content, userId, imageUrl });
    res.status(201).json({
        message: "게시글 등록 완료",
        data: newArticle,
    });
})));
articleRouter.route('/:articleId')
    .get((0, validation_middleware_js_1.validate)(validation_middleware_js_1.getArticleByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId } = req.params;
    let currentUserId = null;
    try {
        if (req.headers.authorization) {
            yield new Promise((resolve, reject) => {
                // verifyAccessToken 미들웨어를 Promise로 감싸 비동기적으로 실행
                (0, auth_js_1.verifyAccessToken)(req, res, (err) => {
                    if (err) {
                        // 토큰 검증 중 에러(만료 등) 발생 시, isLiked 처리를 위해 currentUserId를 null로 유지하고 진행
                        currentUserId = null;
                        resolve(); // 에러를 던지지 않고 Promise를 성공으로 처리하여 다음 로직 진행
                    }
                    else {
                        // 토큰이 유효하면 req.user에서 userId를 가져옴
                        currentUserId = req.user.userId;
                        resolve(); // 성공적으로 사용자 ID를 설정했으므로 Promise 성공 처리
                    }
                });
            });
        }
    }
    catch (error) {
        currentUserId = null; // 에러 발생 시 사용자 ID는 null
    }
    const article = yield (0, articles_service_js_1.findArticleById)(articleId, currentUserId);
    res.status(200).json({
        message: "조회하신 게시글입니다",
        data: article,
    });
})))
    .patch(auth_js_1.verifyAccessToken, upload_middleware_js_1.default.single('image'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getArticleByIdSchema, 'params'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateArticleSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { articleId } = req.params;
    const updateData = req.body;
    if (req.file) {
        updateData.imageUrl = `/uploads/articles/${req.file.filename}`;
    }
    const patchArticle = yield (0, articles_service_js_1.updateArticle)(articleId, userId, updateData);
    res.status(200).json({
        message: "수정하신 게시글입니다",
        data: patchArticle,
    });
})))
    .delete(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getArticleByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { articleId } = req.params;
    yield (0, articles_service_js_1.deleteArticle)(articleId, userId);
    res.status(204).end();
})));
articleRouter.route('/:articleId/like')
    .post(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getArticleByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleId } = req.params;
    const loggedInUserId = req.user.userId;
    const result = yield (0, articles_service_js_1.toggleArticleLike)(loggedInUserId, articleId);
    res.status(200).json(result);
})));
exports.default = articleRouter;
