import express from 'express';
import productRouter from './routes/products.router.js';
import userRouter from './routes/users.router.js';
import articleRouter from './routes/articles.router.js';
import cookieParser from 'cookie-parser';
import productCommentRouter from './routes/productComments.router.js';
import articleCommentsRouter from './routes/articleComments.router.js';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/products/:productId/comments', productCommentRouter);
app.use('/api/articles', articleRouter);
app.use('/api/articles/:articleId/comments', articleCommentsRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: '요청하신 경로를 찾을 수 없습니다.' });
});

app.use(errorHandler);

export default app;