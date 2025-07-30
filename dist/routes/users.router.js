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
const path_1 = __importDefault(require("path"));
const auth_js_1 = require("../middlewares/auth.js");
const asyncHandler_js_1 = __importDefault(require("../utils/asyncHandler.js"));
const upload_middleware_js_1 = __importDefault(require("../middlewares/upload.middleware.js"));
const users_service_js_1 = require("../services/users.service.js");
const validation_middleware_js_1 = require("../middlewares/validation.middleware.js");
const userRouter = express_1.default.Router();
// --- 회원가입 및 전체 사용자 조회 라우트 ---
userRouter.route('/')
    .post((req, res, next) => {
    req.uploadPath = path_1.default.resolve(process.cwd(), 'uploads', 'users');
    next();
}, upload_middleware_js_1.default.single('image'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.createUserSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrl = req.file ? `/uploads/users/${req.file.filename}` : null;
    const { username, email, password, address } = req.body;
    const newUser = yield (0, users_service_js_1.createUser)(username, email, password, address, imageUrl);
    res.status(201).json({
        message: '회원가입이 성공적으로 완료되었습니다.',
        user: newUser,
    });
})));
// .get( // GET /api/users (모든 사용자 조회) 라우트
//   asyncHandler(async (req, res, next) => {
//     // 이 라우트를 활성화하려면 verifyAccessToken 또는 관리자 권한 미들웨어를 추가하는 것이 좋습니다.
//     const users = await findAllUsers();
//     res.status(200).json({
//       message: '검색하신 회원목록입니다.',
//       data: users,
//     });
//   })
// );
// --- 로그인 라우트 ---
userRouter.post('/login', (0, validation_middleware_js_1.validate)(validation_middleware_js_1.loginSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = yield (0, users_service_js_1.loginUser)(email, password);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // 2주 (2 weeks)
    });
    res.status(200).json({
        message: '로그인 성공!',
        accessToken: accessToken,
        user: user,
    });
})));
userRouter.post('/logout', auth_js_1.verifyAccessToken, (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    yield logoutUser(userId);
    // 클라이언트 측 쿠키에서 리프레시 토큰을 제거하도록 지시
    res.clearCookie('refreshToken', {
        httpOnly: true, // HTTP Only 쿠키
        secure: true,
        path: '/api/users/refresh-token',
    });
    res.status(200).json({
        message: '로그아웃이 성공적으로 완료되었습니다.',
    });
})));
// --- 토큰 갱신 라우트 (Refresh Token Rotation 적용) ---
userRouter.post('/refresh-token', auth_js_1.verifyRefreshToken, (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const oldRefreshToken = req.cookies.refreshToken;
    const user = yield (0, users_service_js_1.findUserById)(userId, {
        id: true,
        refreshToken: true,
    });
    if (!user) {
        return res.status(401).json({ message: '인증 정보와 일치하는 사용자가 없습니다.' });
    }
    if (user.refreshToken !== oldRefreshToken) {
        yield (0, users_service_js_1.updateUser)(user.id, { refreshToken: null });
        return res.status(401).json({ message: '유효하지 않거나 이미 사용된 리프레시 토큰입니다. 다시 로그인 해주세요.' });
    }
    const newAccessToken = (0, users_service_js_1.createToken)(user, 'access');
    const newRefreshToken = (0, users_service_js_1.createToken)(user, 'refresh');
    yield (0, users_service_js_1.updateUser)(user.id, { refreshToken: newRefreshToken });
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // 2주 (2 weeks)
    });
    res.status(200).json({
        message: '새로운 액세스 토큰이 발급되었습니다.',
        accessToken: newAccessToken,
    });
})));
// --- 로그인한 사용자 정보 조회, 수정, 삭제 라우트 ---
userRouter.route('/me')
    .get(auth_js_1.verifyAccessToken, (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    console.log(req.user);
    // findUserById 호출 시 refreshToken을 제외하도록 selectOptions 명시
    const user = yield (0, users_service_js_1.findUserById)(userId, {
        id: true,
        username: true,
        email: true,
        address: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
    });
    res.status(200).json({
        message: '내 정보 조회 성공!',
        user: user,
    });
})))
    .patch(auth_js_1.verifyAccessToken, (req, res, next) => {
    req.uploadPath = path_1.default.resolve(process.cwd(), 'uploads', 'users');
    next();
}, upload_middleware_js_1.default.single('image'), (0, validation_middleware_js_1.validate)(validation_middleware_js_1.updateUserSchema, 'body'), (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const updateData = req.body;
    if (req.file) {
        updateData.imageUrl = `/uploads/users/${req.file.filename}`;
    }
    const updatedUser = yield (0, users_service_js_1.updateUser)(userId, updateData);
    res.status(200).json({
        message: '회원 정보가 성공적으로 업데이트되었습니다.',
        data: updatedUser,
    });
})))
    .delete(auth_js_1.verifyAccessToken, (0, asyncHandler_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    yield (0, users_service_js_1.updateUser)(userId, { refreshToken: null });
    yield (0, users_service_js_1.deleteUser)(userId);
    res.status(204).end();
})));
exports.default = userRouter;
