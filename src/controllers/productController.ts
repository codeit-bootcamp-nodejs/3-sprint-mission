import { RequestHandler } from "express";
import { HttpError } from "../types/error";
import { PaginationQueryDto } from "../types/common";
import ProductService from "../services/productService";
import { checkUser } from "../utils/checkUser";
import { PRODUCT_ERROR } from "../constants/productConstants";

/**
 * 상품 목록 조회 요청 핸들러
 * @param req offset, limit, orderBy, keyword를 쿼리 파라미터로 받습니다.
 * @param res 상품 목록과 메타데이터를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 * 
 * @throws {HttpError} 상품 목록 조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 상품 목록 조회 요청에 필요한 쿼리등을 받아 상품 목록을 조회합니다.
 * 쿼리 파라미터로 offset, limit, orderBy, keyword를 받습니다.
 * status 500과 함께 상품 목록 조회 중 오류가 발생했음을 나타냅니다.
 */

const getProductList: RequestHandler = async (req, res, next) => {
  const { offset, limit, keyword } = req.query as PaginationQueryDto;
  const parsedOffset = parseInt(offset ? offset : '0');
  const parsedLimit = parseInt(limit ? limit : '10');
  let orderBy = req.query.orderBy;
  const typeOrderBy = orderBy === 'recent' ? orderBy = 'desc' : orderBy = 'asc';
  try {
    const products = await ProductService.getProductList(
      parsedOffset,
      parsedLimit,
      typeOrderBy,
      keyword
    );
    res.json(products);
  } catch (error) {
    next(new HttpError(PRODUCT_ERROR.GET_PRODUCT_LIST_ERROR, 500));
  }
};

/**
 * 상품 정보 조회 요청 핸들러
 * @param req 상품 ID를 URL 파라미터로 받습니다.
 * @param res 상품 정보를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 상품 정보 조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 상품 ID를 URL 파라미터로 받아 해당 상품의 정보를 조회합니다.
 * 상품이 존재하지 않는 경우 404 상태 코드와 함께 에러 메시지를 반환합니다.
 * status 500과 함께 상품 정보 조회 중 오류가 발생했음을 나타냅니다.
 */

const getProduct: RequestHandler = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const data = await ProductService.getProduct(productId);
    res.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(new HttpError(PRODUCT_ERROR.GET_PRODUCT_ERROR, 500));
    }
  }
};

/**
 * 상품 생성 요청 핸들러
 * @param req 상품 정보를 요청 본문으로 받습니다.
 * @param res 생성된 상품 정보를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 상품 생성 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 로그인한 유저만이 상품을 생성할 수 있습니다. 유저정보는 토큰으로 생성된 userId를 통해 확인합니다.
 * 상품 정보를 요청 본문으로 받아 상품을 생성합니다.
 * status 401과 함께 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404와 함께 존재하지 않는 유저일 경우 에러 메시지를 반환합니다.
 * status 500과 함께 상품 생성 중 오류가 발생했음을 나타냅니다.
 */

const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const user = await checkUser(userId);
    const data = { ...req.body, userId: user.id };
    const product = await ProductService.createProduct(data);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(new HttpError(PRODUCT_ERROR.CREATE_PRODUCT_ERROR, 500));
    }
  }
};

/**
 * 상품 수정 요청 핸들러
 * @param req 상품 ID와 수정할 정보를 요청 본문으로 받습니다.
 * @param res 수정된 상품 정보를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 상품 수정 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 상품 ID와 수정할 정보를 요청 본문으로 받아 해당 상품을 수정합니다.
 * status 404와 함께 존재하지 않는 상품일 경우 에러 메시지를 반환합니다.
 * status 500과 함께 상품 수정 중 오류가 발생했음을 나타냅니다.
 */

const patchProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await ProductService.patchProduct(id, req.body);
    res.json(product);
  } catch (error) {
    next(new HttpError(PRODUCT_ERROR.PATCH_PRODUCT_ERROR, 500));
  }
};

/**
 * 상품 삭제 요청 핸들러
 * @param req 상품 ID를 URL 파라미터로 받습니다.
 * @param res 삭제 성공 여부를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 상품 삭제 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 상품 ID를 URL 파라미터로 받아 해당 상품을 삭제합니다.
 * 존재하지 않는 상품일 경우 404 상태 코드와 함께 에러 메시지를 반환합니다.
 * status 500과 함께 상품 삭제 중 오류가 발생했음을 나타냅니다.
 */

const deleteProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    await ProductService.deleteProduct(id);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError(PRODUCT_ERROR.DELETE_PRODUCT_ERROR, 500));
  }
};

/**
 * 상품 좋아요 요청 핸들러
 * @param req 상품 ID를 URL 파라미터로 받습니다.
 * @param res 성공 시 status 204를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 * 
 * @throws {HttpError} 상품 좋아요 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 로그인한 유저만이 상품에 좋아요를 할 수 있습니다. 유저정보는 토큰으로 생성된 userId를 통해 확인합니다.
 * 상품 ID를 URL 파라미터로 받아 해당 상품에 좋아요를 추가합니다.
 * status 401과 함께 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404와 함께 존재하지 않는 유저일 경우 에러 메시지를 반환합니다.
 * status 500과 함께 상품 좋아요 중 오류가 발생했음을 나타냅니다.
 */

const likeProduct: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user = await checkUser(userId);
  const productId = req.params.id;
  try {
    await ProductService.likeProduct(user.id, productId);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError('상품 좋아요 중 오류가 발생했습니다.', 500));
  }
};

/**
 * 상품 좋아요 취소 요청 핸들러
 * @param req 상품 ID를 URL 파라미터로 받습니다.
 * @param res 성공 시 status 204를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 * 
 * @throws {HttpError} 상품 좋아요 취소 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 로그인한 유저만이 상품에 좋아요를 취소할 수 있습니다. 유저정보는 토큰으로 생성된 userId를 통해 확인합니다.
 * 상품 ID를 URL 파라미터로 받아 해당 상품에 좋아요를 취소합니다.
 * status 401과 함께 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404와 함께 존재하지 않는 유저일 경우 에러 메시지를 반환합니다.
 * status 500과 함께 상품 좋아요 취소 중 오류가 발생했음을 나타냅니다.
 */

const unlikeProduct: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user = await checkUser(userId);
  const productId = req.params.id;
  try {
    await ProductService.unlikeProduct(user.id, productId);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError('상품 좋아요 취소 중 오류가 발생했습니다.', 500));
  }
};

/**
 * 상품 정보 조회 요청 핸들러
 * @param req 상품 ID를 URL 파라미터로 받습니다.
 * @param res 상품 정보를 반환합니다.
 * @param next 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 상품 정보 조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 유저 ID를 토큰에서 가져와 해당 유저가 좋아요한 상품 정보를 포함하여 조회합니다.
 * 상품 ID를 URL 파라미터로 받아 해당 상품의 정보를 조회합니다.
 * 기본적인 상품조회라 달리 isLiked 필드를 추가하여 해당 상품이 좋아요되었는지 여부를 반환합니다.
 * status 401과 함께 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404와 함께 존재하지 않는 유저일 경우 에러 메시지를 반환합니다.
 * status 404와 함께 존재하지 않는 상품일 경우 에러 메시지를 반환합니다.
 * status 500과 함께 상품 정보 조회 중 오류가 발생했음을 나타냅니다.
 */

const getProductWithLike: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user = await checkUser(userId);
  const productId = req.params.id;
  try {
    const data = await ProductService.getProductWithLike(user.id, productId);
    res.json(data);
  } catch (error) {
    next(new HttpError('상품 정보 조회 중 오류가 발생했습니다.', 500));
  }
};


export default {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  getProductWithLike
}