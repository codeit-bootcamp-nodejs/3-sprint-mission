import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouter from './routes/product.js';
import articleRouter from './routes/article.js';
import { PrismaClient } from '@prisma/client';
import { upload } from './middlewares/upload.js';
import { errorHandler } from './handler/errorHandler.js';

dotenv.config() //env 파일에 정의된 환경변수를 불러와 사용할 수 있게 해주는 명령어

const prisma = new PrismaClient();
const app = express()

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
  res.status(201).json({ path: `/uploads/${req.file.filename}` });
});

app.use(cors()) // 모든 출처(origin)에서 오는 요청 허용
app.use(express.json())
app.use('/products', productRouter)
app.use('/articles', articleRouter)

app.use((req, res) => {
  res.status(404).json({ error: '잘못된 경로입니다.' });
})

app.use(errorHandler)

app.listen(3000, () => console.log('Server is listening on port 3000'))