import userRepository from "../repository/userRepository.js"
import hash from "../hash.js"
import jwt from 'jsonwebtoken'
// import { expressjwt, ExpressJwtRequest } from "express-jwt"

const createUser = async (user) => {
  const { email, nickname, password } = user;
  const existedUser = await userRepository.findByEmail(user.email) // email 중복 확인

  if (existedUser) {
    const error = new Error('User already exists')
    error.code = 422
    error.data = { email: user.email }
    throw error
  }

  const hashed = await hash.hashPassword(user.password)
  const newUser = await userRepository.save({email, nickname, password: hashed})

  return await userRepository.filterSensitiveUserData(newUser)
}

const getUser = async (email, password) => {
  const user = await userRepository.findByEmail(email)
  if (!user) {
    const error = new Error('Unauthorized')
    error.code = 401
    throw error
  }

  const savedPassword = user.password

  const isMatch = await hash.verifyPassword(password, savedPassword)
  if (!isMatch) {
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }

  return userRepository.filterSensitiveUserData(user)
}

const createToken = async (user) => {
  const payload = { userId: user.id }
  const options = { expiresIn: '1h' }

  // refresh 토큰은 나중에
  // if (type = "refresh") {
  //   options.expiresIn = '1m'
  // }

  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

export default {
  createUser,
  getUser,
  createToken
}