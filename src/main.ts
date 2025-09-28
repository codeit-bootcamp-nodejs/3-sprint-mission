import server from './app';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
  console.log(`Socket.IO 서버도 ${PORT} 포트에서 실행 중입니다.`);
});
