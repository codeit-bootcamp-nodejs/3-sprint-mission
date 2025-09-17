import express, { Router } from 'express';
import validations from '../middlewares/validations.js';
import userController from '../controllers/userController.js';
import auth from '../middlewares/auth.js'

const userRouter: Router = express.Router();

userRouter.route('/sign-up')
    .post(validations.createUserValidation, userController.postUser)

userRouter.route('/login')
    .post(validations.getUserValidation, userController.getUser)

userRouter.route('/token/refresh') // refresh 토큰으로 access 토큰 재발급
    .post(auth.verifyRefreshToken, userController.refreshAccessToken)

userRouter.route('/password')
    .patch(auth.verifyAccessToken, auth.verifyUserAuth, userController.patchUserPassword)

userRouter.route('/products')
    .get(auth.verifyAccessToken, userController.getUsersProductList)

userRouter.route('/')
    .get(auth.verifyAccessToken, userController.getUserWithToken)
    .patch(auth.verifyAccessToken, auth.verifyUserAuth, userController.patchUser)

export default userRouter;