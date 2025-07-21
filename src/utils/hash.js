import bcrypt from 'bcrypt';

const hashingPassword = async (password) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
  } catch (error) {
    console.log("해싱중 오류발생", error);
    throw error;
  }
}

const verifyPassword = async (inputPassword, password) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, password);
    return isMatch
  } catch (error) {
    console.log("비밀번호 비교중 오류발생", error)
    throw error
  }
}

export default {
  hashingPassword,
  verifyPassword,
}