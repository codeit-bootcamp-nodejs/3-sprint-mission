import express from 'express'
import auth from '../middlewares/auth.js'

const userRouter = express.Router();

userRouter.route('/user')
  .get(auth.verifyAccessToken, )