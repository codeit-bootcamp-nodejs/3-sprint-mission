import express from 'express'
import userService from '../services/userService.js'
import auth from '../middlewares/auth.js'
import userRepository from '../repository/userRepository.js'
import { type } from 'superstruct'
import prisma from '../config/prisma.js'
import { User } from '../structs.js'
import hash from '../hash.js'

const userController = express.Router()

userController.post("/user", async (req, res, next) => { //회원가입
  const { email, nickname, password } = req.body

  try {
    const user = await userService.createUser({ email, nickname, password })
    return res.status(200).json(user)
  } catch (error) {
    next (error);
  }
})

userController.post("/login", async (req, res, next) => { //login. 나중에 refresh 추가
  const { email, password } = req.body
  try {
    const user = await userService.getUser(email, password)
    const accessToken = await userService.createToken(user)
    console.log({ accessToken })
    return res.json({ accessToken })
  } catch (error) {
    next(error) //errorHandler 추가하기
  }
})

userController.get("/my", auth.verifyAccessToken, async (req, res, next) => {
  try {
    const user = await userService.checkUser(req.user)
    const profile = await userRepository.getUserProfile(user.id);
    return res.json(profile)
  } catch (error) {
    next(error)
  }
}
)

userController.patch("/my", auth.verifyAccessToken, async (req, res, next) => { //회원 정보 수정
  try {
    const update = {...req.body}
    if (update.user) {
      update.password = await hash.hashPassword(update.password)
    }
    const user = await userService.checkUser(req.user)
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: update,
    })
    const { password, ...filterSensitiveUserData } = updatedUser;
    return res.status(200).send(filterSensitiveUserData)
  } catch (error) {
    next(error)
  }
}
)

userController.get("/user/productList/:userId", (req, res, next) => {

})

export default userController