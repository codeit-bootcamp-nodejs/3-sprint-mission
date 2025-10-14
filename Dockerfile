# ====================================
# 빌드 스테이지 (build stage)
# ====================================
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-alpine AS my-build-stage

# 작업 디렉터리
WORKDIR /docker-compose-app

# 의존성 모듈 설치
COPY package*.json ./
RUN npm ci

# alpine에서 필요한 패키지 설치 (openssl, python, make 등 네이티브 모듈용)
RUN apk add --no-cache openssl libc6-compat python3 make g++

# Prisma 설정
COPY prisma ./prisma
RUN npm run prisma:generate || true

# 애플리케이션 소스 복사 및 빌드
COPY . .
RUN npm run build

# 프로덕션 의존성만 남기기
RUN npm prune --omit=dev

# ====================================
# 런타임 스테이지 (runtime stage)
# ====================================
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-alpine AS runtime

# alpine에서 런타임 필요 패키지 설치
RUN apk add --no-cache openssl libc6-compat

# 보안을 위해 node 사용자 사용
USER node
WORKDIR /docker-compose-app

# 필요한 파일만 복사
COPY --chown=node:node --from=my-build-stage /docker-compose-app/package*.json ./
COPY --chown=node:node --from=my-build-stage /docker-compose-app/node_modules ./node_modules
COPY --chown=node:node --from=my-build-stage /docker-compose-app/dist ./dist
COPY --chown=node:node --from=my-build-stage /docker-compose-app/prisma ./prisma

# 환경
ENV NODE_ENV=production

EXPOSE 3000

# 앱 시작: Prisma 마이그레이션 후 서버 시작
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]