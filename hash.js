import bcrypt from 'bcrypt'

const hashPassword = async (password) => {
  const plainPassword = password

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds) //매번 랜덤한 salt 생성

  const hashedPassword = await bcrypt.hash(plainPassword, salt)

  console.log('🔐 Hashed Password:', hashedPassword)
  return hashedPassword
}

const verifyPassword = async (inputPassword, savedPassword) => {
  const isMatch = await bcrypt.compare(inputPassword, savedPassword)
  if (!isMatch) {
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  } else {
    return isMatch
  }
}

export default {
  hashPassword,
  verifyPassword,
}