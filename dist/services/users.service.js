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
exports.deleteUser = exports.updateUser = exports.logoutUser = exports.loginUser = exports.findUserById = exports.createUser = exports.createToken = void 0;
const library_1 = require("@prisma/client/runtime/library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const queryHelpers_js_1 = require("../utils/queryHelpers.js");
const hash_js_1 = __importDefault(require("../utils/hash.js"));
// 토큰 생성 유틸리티 함수
const createToken = (user, type) => {
    const payload = { userId: user.id };
    let secret;
    let expiresIn;
    if (type === 'access') {
        secret = process.env.ACCESS_TOKEN_SECRET;
        expiresIn = '1h';
    }
    else if (type === 'refresh') {
        secret = process.env.REFRESH_TOKEN_SECRET;
        expiresIn = '2w';
    }
    else {
        throw new Error('유효하지 않은 토큰 타입입니다.');
    }
    const options = {
        expiresIn: expiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.createToken = createToken;
const createUser = (username, email, password, address, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield queryHelpers_js_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.username === username) {
                throw new library_1.PrismaClientKnownRequestError('이미 사용 중인 사용자 이름입니다.', {
                    code: 'P2002'
                });
            }
            if (existingUser.email === email) {
                throw new library_1.PrismaClientKnownRequestError('이미 사용 중인 이메일입니다.', {
                    code: 'P2002'
                });
            }
        }
        const hashedPassword = yield hash_js_1.default.hashingPassword(password);
        const newUser = yield queryHelpers_js_1.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                imageUrl,
                address,
            },
            select: {
                id: true,
                username: true,
                email: true,
                imageUrl: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
exports.createUser = createUser;
// export const findAllUsers = async () => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         address: true,
//         imageUrl: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });
//     return users;
//   } catch (error) {
//     console.error("Error in findAllUsers service:", error);
//     throw error;
//   }
// };
const findUserById = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, selectOptions = undefined) {
    try {
        const user = yield queryHelpers_js_1.prisma.user.findUnique({
            where: { id },
            // selectOptions가 전달되면 그 값을 사용하고, 없으면 모든 필드를 가져옴
            // 특정 필드만 필요한 경우 호출하는 곳에서 명시적으로 select 객체를 전달
            select: selectOptions || {
                id: true,
                username: true,
                email: true,
                address: true,
                imageUrl: true,
                refreshToken: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new library_1.PrismaClientKnownRequestError('사용자를 찾을 수 없습니다.', {
                code: 'P2025',
                meta: { modelName: 'User', cause: 'record not found' }
            });
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.findUserById = findUserById;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield queryHelpers_js_1.prisma.user.findUnique({
        where: { email: email }
    });
    if (!user) {
        throw new Error('이메일 또는 비밀번호를 확인해주세요.');
    }
    const isPasswordValid = yield hash_js_1.default.verifyPassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('이메일 또는 비밀번호를 확인해주세요.');
    }
    // 엑세스 토큰과 리프레시 토큰 생성
    const accessToken = (0, exports.createToken)(user, 'access');
    const refreshToken = (0, exports.createToken)(user, 'refresh');
    yield queryHelpers_js_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken }
    });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken, // 이 refreshToken이 라우터로 반환되어 쿠키에 설정됩니다.
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            address: user.address,
            imageUrl: user.imageUrl,
        }
    };
});
exports.loginUser = loginUser;
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 해당 사용자의 refreshToken 필드를 null로 업데이트하여 무효화
        const updatedUser = yield queryHelpers_js_1.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
            select: { id: true, username: true }
        });
        if (!updatedUser) {
            // 사용자를 찾을 수 없거나 업데이트에 실패한 경우
            throw new library_1.PrismaClientKnownRequestError('로그아웃할 사용자를 찾을 수 없습니다.', {
                code: 'P2025',
                meta: { modelName: 'User', cause: 'user not found for logout' }
            });
        }
        return { message: '로그아웃 성공', userId: updatedUser.id };
    }
    catch (error) {
        throw error;
    }
});
exports.logoutUser = logoutUser;
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (updateData.password) {
            updateData.password = yield hash_js_1.default.hashingPassword(updateData.password);
        }
        const updatedUser = yield queryHelpers_js_1.prisma.user.update({
            where: {
                id,
            },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                address: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    catch (error) {
        throw error;
    }
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield queryHelpers_js_1.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                address: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return deletedUser;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteUser = deleteUser;
