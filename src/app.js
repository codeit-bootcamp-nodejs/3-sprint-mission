import express from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import productRouter from './routes/products.router.js';
import userrouter from './routes/users.router.js';
import articlerouter from './routes/articles.router.js';
import productCommentRouter from './routes/productComments.router.js';
import articleCommentsRouter from './routes/articleComments.router.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/products', productRouter);
app.use('/api/users', userrouter);
app.use('/api/articles', articlerouter);
app.use('/api/products/:productsId/comments', productCommentRouter);
app.use('/api/articles/:articleId/comments', articleCommentsRouter);

app.use((err, req, res, next) => {
  console.error("전역 에러 발생:", err);

  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({
      message: '요청한 리소스가 이미 존재합니다 (이메일 중복 등).',
      details: err.meta?.target ? `중복된 필드: ${err.meta.target.join(', ')}` : '자세한 정보 없음',
    });
  }
  if (err.name === 'DuplicateEmailError') {
    return res.status(409).json({ message: err.message });
  }
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({ message: '요청한 데이터를 찾을 수 없습니다.' });
  }
  if (err.message === 'Validation Error' && err.details) {
    return res.status(400).json({ message: err.message, details: err.details });
  }
  res.status(err.statusCode || 500).json({
    message: err.message || '서버 내부 오류가 발생했습니다.',
  });
});

export default app;