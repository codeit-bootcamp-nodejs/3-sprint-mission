import express from 'express';
import productRouter from './routes/productRoute.js';
import articleRouter from './routes/articleRoute.js';
import cors from 'cors';
import { upload, uploadImage } from './services/imageUpload.js'
import errorHandler from './middlewares/errorHandler.js';
import * as dotenv from 'dotenv'
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();

app.use(cors()); //CORS 설정
app.use(express.json());
app.use(cookieParser())

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/users', userRouter);

app.use('/images', express.static('uploads'))

app.post('/images/upload', upload.single('attachment'), uploadImage); // 이미지 확장자 검사 필요

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log("Server Starting..."));