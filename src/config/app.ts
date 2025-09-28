import * as dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import express, { Express } from 'express';
import productRouter from '../routes/productRoute'
import articleRouter from '../routes/articleRoute'
import userRouter from '../routes/userRoute'
import notificationRouter from '../routes/notificationRoute';
import errorHandler from '../middlewares/errorHandler'
import { upload, uploadImage } from '../services/imageUpload'

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

export { app }