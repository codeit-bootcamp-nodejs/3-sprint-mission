import * as dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import express, { Express } from 'express';
import productRouter from './routes/productRoute.js'
import articleRouter from './routes/articleRoute.js'
import userRouter from './routes/userRoute.js'
import notificationRouter from './routes/notificationRoute.js';
import errorHandler from './middlewares/errorHandler.js'
import { upload, uploadImage } from './services/imageUpload.js'
import http from 'http'
import { createSocketIo } from './config/socket-io.js';


dotenv.config()

const app: Express = express();

// express Part
app.use(cors()); //CORS 설정
app.use(express.json());
app.use(cookieParser())

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/users', userRouter);
app.use('/notifications', notificationRouter)

app.use('/images', express.static('uploads'))

app.post('/images/upload', upload.single('attachment'), uploadImage); // 이미지 확장자 검사 필요

app.use(errorHandler);

// Socket.IO Part
const server = http.createServer(app);
const io = createSocketIo(server);

server.listen(process.env.PORT || 3000, () => console.log("Server Starting..."));

export { io }