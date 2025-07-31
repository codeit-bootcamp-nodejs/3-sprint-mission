import express from 'express'
import auth from '../middlewares/auth'

const userRouter = express.Router();

userRouter.route('/user')
  .get(auth.verifyAccessToken, )