import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import articleRouter from './routes/articleRouter.js';
import productCommentRouter from './routes/productCommentsRouter.js';
import articleCommentsRouter from './routes/articleCommentsRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/products/:productId/comments', productCommentRouter);
app.use('/api/articles', articleRouter);
app.use('/api/articles/:articleId/comments', articleCommentsRouter);

app.use(errorHandler);

export default app;