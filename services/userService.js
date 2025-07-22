import userRepository from "../repository/userRepository.js"

const createUser = async (user) => {
  const existedUser = await userRepository.findByEmail(user.email)

  if (existedUser) {
    const error = new Error('User already exists')
    error.code = 422
    error.data = { email: user.email }
    throw error
  } else {
    const newUser = await userRepository.save(user)
    return await userRepository.filterSensitiveUserData(user)
  }
}

export default {
  createUser
}