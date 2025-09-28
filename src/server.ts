import * as dotenv from 'dotenv'
import http from 'http'
import { app } from './config/app';
import { createSocketIo } from './config/socket-io';

dotenv.config()

// Server Create
const server = http.createServer(app);
// Socket.IO Part
createSocketIo(server);

server.listen(process.env.PORT || 3000, () => console.log("Server Starting..."));
