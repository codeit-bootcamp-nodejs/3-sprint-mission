import { RequestHandler } from 'express';
import userService from '../services/userService';

/**
 * 유저 생성 요청 핸들러
 * @param req body에 유저 정보 포함
 * @param res 생성된 유저 정보 반환
 * @param next 다음 미들웨어로 에러 전달
 * 
 * @returns status 201과 생성된 유저 정보
 * @throws {Error} 유저 생성 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 *
 * 유저 생성 요청 핸들러는 유저 정보를 받아서 유저를 생성하고, 생성된 유저 정보를 반환합니다.
 * 유저 생성 시 필요한 정보는 email, nickname, password, image입니다.
 * 유저 생성 시, 비밀번호는 해싱되어 저장됩니다.
 * 유저 생성에 실패할 경우, 에러를 next로 전달합니다.
 * status 409는 이미 존재하는 이메일로 유저를 생성하려고 할 때 발생합니다.
 * status 500은 유저 생성 중 다른 오류가 발생했을 때 발생합니다.
 * 
 */

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const user = {
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password,
      image: req.body.image
    }
    const createdUser = await userService.userCreate(user);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
}

/**
 * 유저 정보 조회 요청 핸들러
 * @param req 토큰을 통해 유저 아이디를 가져옵니다.
 * @param res 유저 정보 반환
 * @param next 다음 미들웨어로 에러 전달
 * 
 * @returns status 200과 유저 정보
 * @throws {Error} 유저 정보 조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 
 * 유저 정보 조회 시, 토큰에서 유저 아이디를 가져와 해당 유저의 정보를 반환합니다.
 * 유저 정보가 존재하는 경우, 해당 유저 정보를 반환합니다.
 * 유저 아이디가 없을 경우, 401 상태 코드와 함께 에러 메시지를 반환합니다.
 * 유저 정보가 존재하지 않는 경우, 404 상태 코드와 함께 에러 메시지를 반환합니다.
 */

const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  try {
    const user = await userService.getUser(userId);
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * 유저 정보 수정 요청 핸들러
 * @param req 토큰을 통해 유저 아이디를 가져옵니다.
 * @param res 수정된 유저 정보 반환
 * @param next 다음 미들웨어로 에러 전달
 * 
 * @returns status 200과 수정된 유저 정보
 * @throws {Error} 유저 정보 수정 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 
 * 유저 정보 수정 시, 토큰에서 유저 아이디를 가져와 해당 유저의 정보를 수정합니다.
 * 수정할 수 있는 정보는 nickname과 image입니다.
 * 유저 정보가 존재하는 경우, 수정된 유저 정보를 반환합니다.
 * 유저 아이디가 없을 경우, 401 상태 코드와 함께 에러 메시지를 반환합니다.
 * 유저 정보가 존재하지 않는 경우, 404 상태 코드와 함께 에러 메시지를 반환합니다.
 */

const userPatch: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const data = { nickname: req.body.nickname, image: req.body.image }
  try {
    const updatedUser = await userService.updateUser(data, userId);
    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * 유저가 등록한 상품 정보 조회 요청 핸들러
 * @param req 토큰을 통해 유저 아이디를 가져옵니다.
 * @param res 유저가 등록한 상품 정보 반환
 * @param next 다음 미들웨어로 에러 전달
 * 
 * @returns status 200과 유저가 등록한 상품 정보
 * @throws {Error} 유저 등록한 상품 조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 
 * 유저가 등록한 상품 정보 조회 시, 토큰에서 유저 아이디를 가져와 해당 유저가 등록한 상품 정보를 반환합니다.
 * 유저가 등록한 상품 정보가 존재하는 경우, 해당 상품 정보를 반환합니다.
 * 유저 아이디가 없을 경우, 401 상태 코드와 함께 에러 메시지를 반환합니다.
 * 유저 정보가 존재하지 않는 경우, 404 상태 코드와 함께 에러 메시지를 반환합니다.
 */

const getUserRegisteredProducts: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  try {
    const products = await userService.getUserRegisteredProducts(userId);
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

/**
 * 유저가 좋아요한 상품 정보 조회 요청 핸들러
 * @param req 토큰을 통해 유저 아이디를 가져옵니다.
 * @param res 유저가 좋아요한 상품 정보 반환
 * @param next 다음 미들웨어로 에러 전달
 * 
 * @returns status 200과 유저가 좋아요한 상품 정보
 * @throws {Error} 유저가 좋아요한 상품조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 *
 * 유저가 좋아요한 상품 정보 조회 시, 토큰에서 유저 아이디를 가져와 해당 유저가 좋아요한 상품 정보를 반환합니다.
 * 유저가 좋아요한 상품 정보가 존재하는 경우, 해당 상품 정보를 반환합니다.
 * 유저 아이디가 없을 경우, 401 상태 코드와 함께 에러 메시지를 반환합니다.
 * 유저 정보가 존재하지 않는 경우, 404 상태 코드와 함께 에러 메시지를 반환합니다.
 */

const getUserLikedProducts: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  try {
    const products = await userService.getUserLikedProducts(userId);
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

export default {
  createUser,
  getUser,
  userPatch,
  getUserRegisteredProducts,
  getUserLikedProducts
}
