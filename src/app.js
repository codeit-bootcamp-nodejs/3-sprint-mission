import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/errorHandler.js';

import productRoutes from './routes/productRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/products', productRoutes);
app.use('/articles', articleRoutes);
app.use('/upload', uploadRoutes);
app.use('/comments/', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
})

app.use(errorHandler);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})