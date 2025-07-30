import jwt from 'jsonwebtoken'
import userRepository from '../repositories/userRepository.js';
import { hashPassword, verifyPassword } from '../utils/passwordHash.js';

/**
 * 
 * @param {Object} userBody email, nickname, password가 들어옵니다.
 * @returns {Object} 비밀번호와 같은 민감한 정보가 제외된 객체를 반환합니다.
 */
async function createUser(userBody) {
    const { email, nickname, password, image } = userBody;
    const userChecker = await userRepository.findByEmail(email);
    if (userChecker) {
        const error = new Error('User already exists')
        error.code = 401
        throw error
    }
    const user = await userRepository.save(email, nickname, hashPassword(password), image);

    return filterSensitiveUserData(user);
}

async function getUser(email, password) {
    const user = await userRepository.findByEmail(email)
    if (!user) {
        const error = new Error('Not Found')
        error.code = 404
        throw error
    }
    verifyPassword(password, user.password)
    return filterSensitiveUserData(user)
}

const filterSensitiveUserData = (user) => {
    const { password, refreshToken, ...rest } = user
    return rest
}

const createToken = (user, type) => {
  const payload = { userId: user.id }
  let expiresIn = '1h'
  
  if (type === 'refresh') {
	  expiresIn = '2w'
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

const refreshingToken = async (userId, refreshToken) => {
  const user = await userRepository.findById(userId)
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('Unauthorized')
    error.code = 401
    throw error
  }
  return createToken(user)
}

const getUserById = async (id) => { // 토큰으로 전달받은 것이므로 무조건 id가 있음
    const user = await userRepository.findById(id)
    return filterSensitiveUserData(user)
}

const updateUser = async (userBody, id) => {
    const updatedUser = await userRepository.update(userBody, id)
    return filterSensitiveUserData(updatedUser)
}

const updateUserPassword = async (userBody, id) => {
    const { currentPassword, newPassword } = userBody
    // 1. 받은 비밀번호와 저장된 비밀번호 체크
    const user = await userRepository.findById(id)
    verifyPassword(currentPassword, user.password)

    // 2. 일치했으면 위 단걔를 통과하였으므로 비밀번호 해싱후 새로운 값으로 저장
    await userRepository.updatePassword(hashPassword(newPassword), id)

    // 3. 비밀번호만 전달할 필요는 없으므로 성공적으로 변경했다는 메세지 전달
    return { message: "Successfully Password Changed" }
}

const getUsersProductList = async (id) => {
    const productList = await userRepository.getProductListById(id)
    return productList
}

export { createUser, getUser, createToken, refreshingToken, getUserById, updateUser, updateUserPassword, getUsersProductList };