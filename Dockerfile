# node js 환경 준비
FROM node:22.16.0

# 소스코드 다운로드
COPY . /panda-market

# 소스코드 디렉토리 이동
WORKDIR /panda-market

# 의존성 패키지 설치 (npm ci)
RUN npm ci

# 소스코드 빌드
RUN npm run build

# 환경 변수 정의
ENV PORT=3000
ENV NODE_ENV='develop'

# 서버 실행
CMD sh -c "npm run prisma:migrate && npm run start"