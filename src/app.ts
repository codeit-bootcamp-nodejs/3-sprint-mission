import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { initWs } from './ws/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

dotenv.config();
const { PORT = 3000 } = process.env;

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// S3로 변경하여 주석 처리
//app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use(routes);

app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'API running' });
});

app.use(errorHandler);

 if (process.env.NODE_ENV !== 'test') {
   const server = http.createServer(app);
   initWs(server);
   server.listen(PORT, () => {
     console.log(`Server listening at http://localhost:${PORT}`);
   });
 }

export { app };
