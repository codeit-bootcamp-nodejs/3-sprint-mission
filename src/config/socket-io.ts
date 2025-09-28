import { Server, Socket } from 'socket.io'
import http from 'http'
import EventType from '../types/event-type'
import { emitUnreadCount } from '../services/notificationService'
import { authSocketToken } from '../middlewares/ws-auth'

let io: Server

const createSocketIo = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })
    // query로 전달받은 토큰을 통해 인증하기
    io.use(authSocketToken);

    io.on(EventType.CONNECTION, async (socket: Socket) => {
        console.log('client connected')
        console.log('SocketID: ', socket.id)

        // 알람은 각 유저마다 보내주어야 하기 때문에 개별로 룸 생성
        const room = socket.data.user.userId.toString()
        socket.join(room);

        // 첫 연결시 안 읽은 알람 개수 보내주기
        await emitUnreadCount(socket.data.user.userId);

        socket.on(EventType.DISCONNECT, () => {
            console.log('client disconnected')
        })
    })
}

export { io, createSocketIo }