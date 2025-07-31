import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errors";

export const convertProductUploadFields = (req: Request, res: Response, next: NextFunction) => {
  // name: String (변환 필요 없음)
  // description: String (변환 필요 없음)
  // price: Int (숫자로 변환)
  if (req.body.price !== undefined && typeof req.body.price === 'string') {
    req.body.price = parseInt(req.body.price, 10);
  }
  // isSold: Boolean (불리언으로 변환)
  // 'true' 문자열은 true로, 'false' 문자열은 false로 변환.
  // 다른 문자열이나 undefined는 validate 스키마에서 처리될 것입니다.
  if (req.body.isSold === 'true') {
    req.body.isSold = true;
  } else if (req.body.isSold === 'false') {
    req.body.isSold = false;
  }
  // tags: ProductTag[] (JSON 문자열에서 배열로 변환)
  // HTTP 클라이언트에서 tags 필드를 "[\"TAG1\", \"TAG2\"]" 형태로 보내야 합니다.
  if (req.body.tags !== undefined && typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e: unknown) {
      const error = new HttpError('태그(tags) 형식이 올바르지 않습니다. JSON 배열 형식으로 입력해주세요.', 400);
      return next(error); // 에러를 다음 미들웨어로 전달
    }
  }
  // stock: Integer (정수로 변환)
  if (req.body.stock !== undefined && typeof req.body.stock === 'string') {
    req.body.stock = parseInt(req.body.stock, 10);
  }
  next();
};