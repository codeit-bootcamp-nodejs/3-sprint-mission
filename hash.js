import bcrypt from 'bcrypt'

const hashPassword = async (password) => {
  const plainPassword = password

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds) //매번 랜덤한 salt 생성

  const hashedPassword = await bcrypt.hash(plainPassword, salt)

  console.log('🔐 Hashed Password:', hashedPassword)
  return hashedPassword
}

const verifyPassword = async (inputPassword, password) => {
  const isValid = await bcrypt.compare(inputPassword, password)
  if (!isValid) {
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }
}

export default {
  hashPassword,
  verifyPassword,
}