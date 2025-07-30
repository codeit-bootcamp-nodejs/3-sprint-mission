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
exports.toggleProductLike = exports.deleteProduct = exports.updateProduct = exports.findProductById = exports.createProduct = exports.findAllProducts = void 0;
const library_1 = require("@prisma/client/runtime/library");
const queryHelpers_js_1 = require("../utils/queryHelpers.js");
const findAllProducts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ offset, limit, sort, search }) {
    const { skip, take } = (0, queryHelpers_js_1.getPaginationParams)({ offset, limit });
    const orderBy = (0, queryHelpers_js_1.getSortParams)({ sort }, 'createdAt');
    const where = (0, queryHelpers_js_1.getSearchParams)(search, ['name', 'description']);
    try {
        const products = yield queryHelpers_js_1.prisma.product.findMany({
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
                        ProductLike: true,
                    },
                },
            },
        });
        return products.map(product => (Object.assign(Object.assign({}, product), { likeCount: product._count.ProductLike, _count: undefined })));
    }
    catch (error) {
        throw error;
    }
});
exports.findAllProducts = findAllProducts;
const createProduct = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, description, price, isSold, tags, stock, userId, imageUrl }) {
    try {
        const product = yield queryHelpers_js_1.prisma.product.create({
            data: {
                name,
                description,
                price,
                isSold,
                tags,
                stock,
                imageUrl,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
        return product;
    }
    catch (error) {
        throw error;
    }
});
exports.createProduct = createProduct;
const findProductById = (productId_1, ...args_1) => __awaiter(void 0, [productId_1, ...args_1], void 0, function* (productId, currentUserId = null) {
    var _a;
    try {
        const product = yield queryHelpers_js_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
                _count: {
                    select: {
                        ProductLike: true,
                    },
                },
                ProductLike: currentUserId
                    ? {
                        where: { userId: currentUserId }, // 현재 유저가 누른 좋아요만 필터링
                        select: { id: true }, // 좋아요 존재 여부만 확인하므로 id 필드만 선택
                    }
                    : false,
            },
        });
        if (!product) {
            throw new library_1.PrismaClientKnownRequestError('상품을 찾을 수 없습니다.', {
                code: 'P2025',
                meta: { modelName: 'Product', cause: 'record not found' },
            });
        }
        // isLiked 필드 계산: currentUserId가 있고, 해당 유저의 좋아요 레코드가 존재하면 true
        const isLiked = currentUserId ? ((_a = product.ProductLike) === null || _a === void 0 ? void 0 : _a.length) > 0 : false;
        const likeCount = product._count.ProductLike;
        // 반환 객체에서 ProductLike 속성 제거 후 isLiked 추가
        const { ProductLike, _count } = product, productWithoutLikes = __rest(product, ["ProductLike", "_count"]);
        return Object.assign(Object.assign({}, productWithoutLikes), { isLiked, likeCount });
        // --- 여기까지 추가/수정 ---
    }
    catch (error) {
        throw error;
    }
});
exports.findProductById = findProductById;
const updateProduct = (productId, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, queryHelpers_js_1.checkProductOwnership)(productId, userId);
        const updatedProduct = yield queryHelpers_js_1.prisma.product.update({
            where: { id: productId },
            data: updateData,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                isSold: true,
                tags: true,
                stock: true,
                imageUrl: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        username: true
                    }
                }
            },
        });
        return updatedProduct;
    }
    catch (error) {
        throw error;
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, queryHelpers_js_1.checkProductOwnership)(productId, userId);
        const deletedProduct = yield queryHelpers_js_1.prisma.product.delete({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                isSold: true,
                tags: true,
                stock: true,
                imageUrl: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return deletedProduct;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteProduct = deleteProduct;
const toggleProductLike = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existinglike = yield queryHelpers_js_1.prisma.productLike.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId,
                },
            },
        });
        if (existinglike) {
            yield queryHelpers_js_1.prisma.productLike.delete({
                where: {
                    id: existinglike.id
                },
            });
            return { liked: false, message: '좋아요를 취소하였습니다' };
        }
        else {
            yield queryHelpers_js_1.prisma.productLike.create({
                data: {
                    userId: userId,
                    productId: productId,
                },
            });
            return { liked: true, message: "좋아요가 추가되었습니다" };
        }
    }
    catch (error) {
        throw error;
    }
});
exports.toggleProductLike = toggleProductLike;
