//환경변수 로딩
import dotenv from 'dotenv';
dotenv.config();
// 프레임워크,외부 라이브러리
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//소켓 관련
import http from 'http';
import { createSocketServer } from './socket/soketServer';


//미들웨어 & 설정
import corsOptions from './config/corsOptions';
import { errorHandler } from './middlewares/errorHandler';
//내부 라우터
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import productRouter from './routes/productRouter';
import { productCommentRouter, freeCommentRouter } from './routes/commentRouter';
import articleRouter from './routes/articleRouter';
import uploadImageRouter from './routes/uploadImageRouter';
import notificationRouter from './socket/notification.router';


const app = express();

//소켓 서버
const server = http.createServer(app);
createSocketServer(server);
//기본 미들웨어
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
//정적 파일 제공
app.use('/files', express.static('uploads'));
//라우터
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/product-comments', productCommentRouter);
app.use('/freeBoard-comments', freeCommentRouter);
app.use('/upload', uploadImageRouter);
app.use('/notifications', notificationRouter);
//에러 핸들러
app.use(errorHandler);

export default server;
