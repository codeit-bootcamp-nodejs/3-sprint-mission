enum EventType {
    LISTENING = 'listening',
    CONNECTION = 'connection',
    OPEN = 'open',
    MESSAGE = 'message',
    CLOSE = 'close',
    ERROR = 'error',
    DISCONNECT = 'disconnect',
    // 추가 커스텀 타입들
    UNREAD = 'unread',
    NOTIFICATION = 'notification'
};

export default EventType