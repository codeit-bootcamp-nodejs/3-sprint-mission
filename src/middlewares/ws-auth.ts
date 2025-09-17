import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET = 'dev-secret' } = process.env;

interface JwtPayload {
    sub: string
    userId?: string
    iat?: number
    exp?: number
};

type NextFunction = (err?: Error) => void

export const authSocketToken = (socket: Socket, next: NextFunction) =>(socket: Socket, next: NextFunction) => {
        const token = socket.handshake.query.token; // postman에서는 auth와 같은 속성 지원 x, 테스트를 위해 쿼리 파라미터로 전달되도록 설계
        if (!token) {
            return next(new Error('Unauthroized: missing Token'));
        }
        try {
            const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;
            socket.data.user = decoded;
            next();
        } catch (err) {
            next(new Error('Unauthorized: invaild Token'));
        }
    }