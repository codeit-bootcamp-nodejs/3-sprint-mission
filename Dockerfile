# ====================================
# 빌드 스테이지 (build stage)
# ====================================
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /docker-compose-app

# alpine 빌드 도구 설치
RUN apk add --no-cache openssl libc6-compat python3 make g++

# npm 레지스트리 최적화
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set maxsockets 5 && \
    npm config set fetch-timeout 60000

# 의존성 설치 (전체 - dev 포함)
COPY package*.json ./
RUN npm ci

# Prisma Client 생성
COPY prisma ./prisma
RUN npx prisma generate

# 소스 복사 & 빌드
COPY . .
RUN npm run build

# ====================================
# 런타임 스테이지 (runtime stage)
# ====================================
FROM node:${NODE_VERSION}-alpine AS runtime

# 런타임 필수 패키지만
RUN apk add --no-cache openssl libc6-compat

WORKDIR /docker-compose-app

# npm 레지스트리 설정 (런타임도)
RUN npm config set registry https://registry.npmmirror.com

# package.json 복사
COPY --chown=node:node package*.json ./

# production 의존성만 새로 설치
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/*

# Prisma 설정
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate

# 빌드 결과물만 복사
COPY --chown=node:node --from=build /docker-compose-app/dist ./dist

# 보안: node 사용자로 전환
USER node

ENV NODE_ENV=production

EXPOSE 3000

# 직접 node 실행 (npm 우회)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]