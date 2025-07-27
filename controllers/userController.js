import express from 'express'
import userService from '../services/userService.js'
import auth from '../middlewares/auth.js'
import userRepository from '../repository/userRepository.js'

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

// userController.get("/user/:userId", (req, res, next) => {
//   const { email, password } = req.body
//   const user = auth.verifyAccessToken(req.headers.authorization)
//   const dbUser = userRepository.findByEmail(id)
//   if (!user || user.email !== dbUser.email) {
//     const error = new Error(`Forbidden`);
//     error.code = 403;
//     throw error;
//   }
//   if (email === req.user.email && user) {
//     let id = req.user.id
//     const profile = userRepository.getUserProfile(id)
//     return res.json(profile)
//   } else {
//     next(error)
//   }
// })

// userController.get("/user/productList/:userId", (req, res, next) => {

// })

export default userController