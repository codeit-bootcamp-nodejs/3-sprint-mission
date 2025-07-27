import express from 'express'
import userService from '../services/userService.js'

const userController = express.Router()

userController.post("/", (req, res, next) => {
  const { email, nickname, password } = req.body

  const user = userService.createUser({ email, nickname, password })
  return res.status(200).json(user)
})

userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await userService.getUser(email, password)
    const accessToken = await userService.createToken(user)
    return res.json({ accessToken })
  } catch (error) {
    next(error) //errorHandler 추가하기
  }
})

userController.get("/user", (req, res, next) => {
  const password = req.body //패스워드 재입력
  //토큰 인증 진행
  const user = userService.getUser(password)
})

userController.get("/user/productList", (req, res, next) => {
  
})

export default userController