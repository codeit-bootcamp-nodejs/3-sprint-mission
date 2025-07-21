import express from 'express';
import {
  createUser,
  // findAllUsers, // findAllUsers 함수 임포트 유지 (주석 처리)
  findUserById,
  updateUser,
  deleteUser,
  loginUser,
  createToken
} from '../services/users.service.js';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/auth.js';
import {
  validate,
  createUserSchema,
  updateUserSchema,
  loginSchema
} from '../middlewares/validation.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import uploadImage from '../middlewares/upload.middleware.js';
import path from 'path';

const userRouter = express.Router();

// --- 회원가입 및 전체 사용자 조회 라우트 ---
userRouter.route('/')
  .post(
    (req, res, next) => {
      req.uploadPath = path.resolve(process.cwd(), 'uploads', 'users');
      next();
    },
    uploadImage.single('image'),
    validate(createUserSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const imageUrl = req.file ? `/uploads/users/${req.file.filename}` : null;
      const { username, email, password, address } = req.body;
      const newUser = await createUser(username, email, password, address, imageUrl);

      res.status(201).json({
        message: '회원가입이 성공적으로 완료되었습니다.',
        user: newUser,
      });
    }))
// .get( // GET /api/users (모든 사용자 조회) 라우트 - 주석 처리됨
//   asyncHandler(async (req, res, next) => {
//     // 이 라우트를 활성화하려면 verifyAccessToken 또는 관리자 권한 미들웨어를 추가하는 것이 좋습니다.
//     // 예를 들어, verifyAccessToken, checkAdminRole 등의 미들웨어 추가
//     const users = await findAllUsers();
//     res.status(200).json({
//       message: '검색하신 회원목록입니다.',
//       data: users,
//     });
//   })
// );

// --- 로그인 라우트 ---
// POST /api/users/login
userRouter.post('/login',
  validate(loginSchema, 'body'),
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(email, password);

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
  })
);

// --- 토큰 갱신 라우트 (Refresh Token Rotation 적용) ---
// POST /api/users/refresh-token
userRouter.post('/refresh-token',
  verifyRefreshToken,
  asyncHandler(async (req, res, next) => {
    const { userId } = req.user;
    const oldRefreshToken = req.cookies.refreshToken;
    console.log('--- REFRESH TOKEN DEBUG ---');
    console.log('1. userId from token:', userId);
    console.log('2. oldRefreshToken (from Postman cookie):', oldRefreshToken);

    const user = await findUserById(userId);
    if (!user) {
      console.log('User not found with userId:', userId);
      return res.status(401).json({ message: '인증 정보와 일치하는 사용자가 없습니다.' });
    }

    console.log('3. user.refreshToken (from DB):', user.refreshToken); // DB에 저장된 값

    if (user.refreshToken !== oldRefreshToken) {
      // 불일치 시, DB의 토큰을 null로 만들고 에러 반환
      console.log('4. Refresh tokens DO NOT match! Invalidating DB token.');
      await updateUser(user.id, { refreshToken: null });
      return res.status(401).json({ message: '유효하지 않거나 이미 사용된 리프레시 토큰입니다. 다시 로그인 해주세요.' });
    }

    // 일치할 경우 (이 부분이 실행되어야 함)
    console.log('5. Refresh tokens MATCH! Issuing new tokens.');

    // createToken 함수를 사용하여 새로운 액세스 토큰과 리프레시 토큰 생성
    const newAccessToken = createToken(user, 'access');
    const newRefreshToken = createToken(user, 'refresh');

    await updateUser(user.id, { refreshToken: newRefreshToken }); // DB에 새 토큰 저장

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
  })
);

// --- 현재 로그인한 사용자 정보 조회, 수정, 삭제 라우트 ---
// GET /api/users/me
// PATCH /api/users/me
// DELETE /api/users/me
userRouter.route('/me')
  .get(
    verifyAccessToken, // 액세스 토큰 필요
    asyncHandler(async (req, res, next) => {
      const userId = req.user.userId;
      const user = await findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      res.status(200).json({
        message: '로그인된 회원 정보입니다.',
        data: user,
      });
    })
  )
  .patch(
    verifyAccessToken, // 액세스 토큰 필요
    (req, res, next) => {
      req.uploadPath = path.resolve(process.cwd(), 'uploads', 'users');
      next();
    },
    uploadImage.single('image'),
    validate(updateUserSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const userId = req.user.userId;
      const updateData = req.body;

      if (req.file) {
        updateData.imageUrl = `/uploads/users/${req.file.filename}`;
      }

      const updatedUser = await updateUser(userId, updateData);

      res.status(200).json({
        message: '회원 정보가 성공적으로 업데이트되었습니다.',
        data: updatedUser,
      });
    })
  )
  .delete(
    verifyAccessToken, // 액세스 토큰 필요
    asyncHandler(async (req, res, next) => {
      const userId = req.user.userId;

      await updateUser(userId, { refreshToken: null });
      await deleteUser(userId);

      res.status(204).end();
    })
  );

export default userRouter;