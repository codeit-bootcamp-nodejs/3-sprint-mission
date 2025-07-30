"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const express_jwt_1 = require("express-jwt");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
// Access Token 검증 미들웨어
exports.verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user',
});
// Refresh Token 검증 미들웨어
exports.verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: REFRESH_TOKEN_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => {
        if (req.cookies && req.cookies.refreshToken) {
            return req.cookies.refreshToken;
        }
        return null;
    },
    requestProperty: 'user',
});
