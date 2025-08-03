import { Router } from 'express';
import { validateUserCreate, validateUserUpdate } from '../middlewares/validateUser';
import auth from '../middlewares/auth';
import userController from '../controllers/userController';


const userRouter = Router();

userRouter.route('/')
  .get(auth.verifyAccessToken, userController.getUser)
  .post(validateUserCreate, userController.createUser)
  .patch(validateUserUpdate, auth.verifyAccessToken, userController.userPatch);

userRouter.get('/me/products', auth.verifyAccessToken, userController.getUserRegisteredProducts);
userRouter.get('/me/liked-products', auth.verifyAccessToken, userController.getUserLikedProducts);

export default userRouter;
