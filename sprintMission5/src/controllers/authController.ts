import { RequestHandler } from 'express';
import authService from '../services/authService';

/**
 * 로그인 요청 핸들러
 * @param req email과 password를 요청 본문에서 가져옵니다.
 * @param res 로그인 성공 시 accessToken을 반환합니다. 쿠키에 refreshToken을 저장합니다.
 * @param next 에러 발생 시 다음 미들웨어로 에러를 전달합니다.
 * @returns status 200과 accessToken
 * 
 * @throws {HttpError} 로그인 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 로그인 요청 핸들러는 사용자의 이메일과 비밀번호를 받아서 로그인 처리를 하고, 성공 시 accessToken을 반환합니다.
 * 또한, refreshToken을 쿠키에 저장하여 클라이언트가 이후 요청에서 사용할 수 있도록 합니다.
 * status 400은 유저가 존재하지 않거나 비밀번호가 일치하지 않을 경우 에러 메시지를 반환합니다.
 * status 401은 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404은 유저가 존재하지 않을 경우 에러 메시지를 반환합니다.
 * status 500은 로그인 중 다른 오류가 발생했을 때 발생합니다.
 */
const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken } = await authService.login(email, password);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/token/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    });
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

/**
 * 토큰 리프레시 요청 핸들러
 * @param req refreshToken을 쿠키에서 가져옵니다.
 * @param res 새로운 accessToken을 반환합니다.
 * @param next 에러 발생 시 다음 미들웨어로 에러를 전달합니다.
 * @returns status 200과 새로운 accessToken을 전달합니다
 * 
 * @throws {HttpError} 토큰 리프레시 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 토큰 리프레시 요청 핸들러는 클라이언트가 보낸 refreshToken을 사용하여 DB에 저장된 리프레시 토큰과 비교하고,
 * 유효한 경우 새로운 accessToken을 생성하여 반환합니다.
 * status 400은 유효하지 않은 리프레시 토큰이거나, 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 401은 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404은 유저가 존재하지 않을 경우 에러 메시지를 반환합니다.
 * status 500은 토큰 리프레시 중 다른 오류가 발생했을 때 발생합니다.
 */

const tokenRefresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.user?.userId;
    const accessToken = await authService.tokenRefresh(refreshToken, userId);
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

/**
 * 비밀번호 변경 요청 핸들러
 * @param req 새 비밀번호와 기존 비밀번호를 요청 본문에서 가져옵니다.
 * @param res 비밀번호 변경 성공 시 성공 메시지를 반환합니다.
 * @param next 에러 발생 시 다음 미들웨어로 에러를 전달합니다.
 * @returns status 200과 성공 메시지를 반환합니다.
 * 
 * @throws {HttpError} 비밀번호 변경 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 비밀번호 변경 요청 핸들러는 사용자의 아이디와 새 비밀번호, 기존 비밀번호를 받아서 비밀번호를 변경합니다.
 * status 400은 새 비밀번호가 유효하지 않거나, 비밀번호 해싱 중 오류가 발생한 경우 에러 메시지를 반환합니다.
 * status 401은 사용자 정보가 일치하지 않거나, 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404은 유저가 존재하지 않을 경우 에러 메시지를 반환합니다.
 * status 500은 비밀번호 변경 중 다른 오류가 발생했을 때 발생합니다.
 */

const changePassword: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  try {
    await authService.changePassword(newPassword, oldPassword, userId);
    const message = "비밀번호가 변경되었습니다"
    return res.json({ message });
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  tokenRefresh,
  changePassword
};