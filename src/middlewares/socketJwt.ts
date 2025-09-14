import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import * as cookie from "cookie";

dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "dev-secret";

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

type NextFunction = (err?: Error) => void;
//객체로 인증정보 전달하기
export const authenticateTokenWithAuth = (
  socket: Socket,
  next: NextFunction
) => {
  const cookieHeader = socket.handshake.headers.cookie as string;
  const cookies = cookie.parse(cookieHeader);
  const token = cookies["access-token"];
  try {
    if (!token) {
      return next(new Error("Unauthorized: missing token"));
    }
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload.userId) {
      return next(new Error("Unauthorized: invalid token payload"));
    }
    socket.data.user = payload;
    return next();
  } catch (error) {
    return next(new Error("Unauthorized: invalid token"));
  }
};
