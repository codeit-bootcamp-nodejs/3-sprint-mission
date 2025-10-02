import { createServer } from 'http';
import { PORT } from './lib/constants';
import socketService from './services/socketService';
import dotenv from 'dotenv'
import app from './app';

dotenv.config({path: `.env${process.env.NODE_ENV || 'development'}`})

const server = createServer(app);
socketService.initialize(server);

server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

export default server