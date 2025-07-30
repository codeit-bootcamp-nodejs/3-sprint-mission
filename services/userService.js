import userRepository from "../repository/userRepository.js"
import hash from "../hash.js"
import jwt from 'jsonwebtoken'

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
  const newUser = await userRepository.save({ email, nickname, password: hashed })

  return await filterSensitiveUserData(newUser)
}

async function getUser(email, password) {
  const user = await userRepository.findByEmail(email)
  if (!user) {
    const error = new Error('Unauthorized')
    error.code = 401
    throw error
  }
  hash.verifyPassword(password, user.password);
  return filterSensitiveUserData(user)
}

const createToken = async (user) => {

  const payload = { email: user.email, userId: user.id }
  const options = { expiresIn: '1h' }

  // refresh 토큰은 나중에
  // if (type = "refresh") {
  //   options.expiresIn = '1m'
  // }

  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

const checkUser = async (payload) => {
  const { email, userId } = payload;
  const dbUser = await userRepository.findById(userId)
  if (email !== dbUser.email) {
    const error = new Error(`Forbidden`);
    error.status = 403;
    throw error;
  }

  return dbUser
}

function filterSensitiveUserData(user) {
  const { password, ...insensitiveData } = user
  return insensitiveData
}

export default {
  createUser,
  getUser,
  createToken,
  checkUser
}