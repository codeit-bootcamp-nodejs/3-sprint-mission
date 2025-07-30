import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

dotenv.config();
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(routes);

app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'API running' });
});

app.use(errorHandler);

// 서버 실행
app.listen(PORT, (): void => {
  console.log(`Server listening at http://localhost:${PORT}`);
});