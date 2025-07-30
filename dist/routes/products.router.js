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
const upload_middleware_js_1 = __importDefault(require("../middlewares/upload.middleware.js"));
const path_1 = __importDefault(require("path"));
const asyncHandler_js_1 = __importDefault(require("../utils/asyncHandler.js"));
const uploadDataConverter_js_1 = require("../utils/uploadDataConverter.js");
const auth_js_1 = require("../middlewares/auth.js");
const products_service_js_1 = require("../services/products.service.js");
const validation_middleware_js_1 = require("../middlewares/validation.middleware.js");
const productRouter = express_1.default.Router();
productRouter.route('/')
    .get((0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, products_service_js_1.findAllProducts)(req.query);
    res.status(200).json({
        message: '상품 목록 조회',
        data: products,
    });
})))
    .post(auth_js_1.verifyAccessToken, (req, res, next) => {
    req.uploadPath = path_1.default.resolve(process.cwd(), 'uploads/products');
    next();
}, upload_middleware_js_1.default.single('image'), uploadDataConverter_js_1.convertProductUploadFields, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.createProductSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrl = req.file ? req.file.path : null;
    const { name, description, price, isSold, tags, stock } = req.body;
    const userId = req.user.userId;
    const newProduct = yield (0, products_service_js_1.createProduct)({
        name,
        description,
        price,
        isSold,
        tags,
        stock,
        userId,
        imageUrl
    });
    res.status(201).json({
        message: '상품 등록 완료',
        data: newProduct,
    });
})));
productRouter.route('/:productId')
    .get((0, validation_middleware_js_1.validate)(validation_middleware_js_1.getProductByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    let currentUserId = null;
    // 액세스 토큰이 있다면, 이를 검증하여 userId를 가져옴
    try {
        if (req.headers.authorization) {
            yield new Promise((resolve, reject) => {
                (0, auth_js_1.verifyAccessToken)(req, res, (err) => {
                    if (err) {
                        currentUserId = null;
                        resolve(); // 에러를 던지지 않고 resolve하여 다음 로직 진행
                    }
                    else {
                        currentUserId = req.user.userId;
                        resolve();
                    }
                });
            });
        }
    }
    catch (error) {
        currentUserId = null;
    }
    const product = yield (0, products_service_js_1.findProductById)(productId, currentUserId);
    res.status(200).json({
        message: '상품 상세 조회',
        data: product,
    });
})))
    .patch(auth_js_1.verifyAccessToken, (req, res, next) => {
    req.uploadPath = path_1.default.resolve(process.cwd(), 'uploads/products');
    next();
}, upload_middleware_js_1.default.single('image'), uploadDataConverter_js_1.convertProductUploadFields, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getProductByIdSchema, 'params'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateProductSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const imageUrl = req.file ? req.file.path : undefined;
    const loggedInUserId = req.user.userId;
    const updateData = req.body;
    if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl;
    }
    else if (req.body.imageUrl !== undefined) {
        updateData.imageUrl = req.body.imageUrl;
    }
    const updatedProduct = yield (0, products_service_js_1.updateProduct)(productId, loggedInUserId, updateData);
    res.status(200).json({
        message: '상품 수정을 성공하였습니다',
        data: updatedProduct,
    });
})))
    .delete(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getProductByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const loggedInUserId = req.user.userId;
    yield (0, products_service_js_1.deleteProduct)(productId, loggedInUserId);
    res.status(204).end();
})));
productRouter.route('/:productId/like')
    .post(auth_js_1.verifyAccessToken, (0, validation_middleware_js_1.validate)(validation_middleware_js_1.getProductByIdSchema, 'params'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const loggedInUserId = req.user.userId;
    const result = yield (0, products_service_js_1.toggleProductLike)(loggedInUserId, productId);
    res.status(200).json(result);
})));
exports.default = productRouter;
