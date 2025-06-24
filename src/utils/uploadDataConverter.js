
import asyncHandler from './asyncHandler.js';

export const convertProductUploadFields = asyncHandler(async (req, res, next) => {
    // name: String (변환 필요 없음)
    // description: String (변환 필요 없음)

    // price: Float (숫자로 변환)
    if (req.body.price !== undefined && typeof req.body.price === 'string') {
        req.body.price = parseFloat(req.body.price);
    }

    // isSold: Boolean (불리언으로 변환)
    if (req.body.isSold === 'true') {
        req.body.isSold = true;
    } else if (req.body.isSold === 'false') {
        req.body.isSold = false;
    }
    // 그 외의 값은 superstruct의 s.boolean()에서 자동으로 false로 변환되지 않으므로,
    // 유효성 검사 오류가 발생하게 됩니다. 이는 원하는 동작일 것입니다.

    // tags: ProductTag[] (JSON 문자열에서 배열로 변환)
    // HTTP 클라이언트에서 tags 필드를 "[\"TAG1\", \"TAG2\"]" 형태로 보내야 합니다.
    if (req.body.tags !== undefined && typeof req.body.tags === 'string') {
        try {
            req.body.tags = JSON.parse(req.body.tags);
        } catch (e) {
            console.error("Product Tags parsing error in convertProductUploadFields:", req.body.tags, e);
        }
    }

    if (req.body.stock !== undefined && typeof req.body.stock === 'string') {
        req.body.stock = parseInt(req.body.stock, 10);
    }
    next();
});


export const convertArticleUploadFields = asyncHandler(async (req, res, next) => {

    next();
});