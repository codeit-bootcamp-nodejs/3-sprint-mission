import { expressjwt } from "express-jwt"
import userRepository from "../repository/userRepository.js"

const verifyAccessToken = expressjwt({
  secret: process.env.Jwt_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user'
})

export default {
  verifyAccessToken,
}